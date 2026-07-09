import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ErpRole } from '../../../shared/types/erp.types';
import { BaseApiService } from '../../../core/api/base/base-api.service';
import { API_ENDPOINTS } from '../../../core/api/constants/api.constants';
import { Observable, tap, throwError, catchError, map, finalize, shareReplay } from 'rxjs';

export interface ErpUser {
  id: string;
  name: string;
  email: string;
  role: ErpRole;
  avatar?: string;
}

export interface PasswordResetRequestResult {
  email: string;
  resetLink?: string | null;
  resetToken?: string | null;
  expiresInMinutes: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly AUTH_KEY = 'erp_temp_auth_state';
  private readonly ROLE_KEY = 'erp_temp_role';
  private _accessToken: string | null = null;
  private _refreshObservable: Observable<string> | null = null;

  // ─── Auth state ──────────────────────────────────────────
  readonly isAuthenticated = signal<boolean>(this.checkInitialState());

  // ─── Current role (Signals-based) ────────────────────────
  /**
   * Temporary: reads role from localStorage.
   * Replace with JWT-decoded role once backend is ready.
   * Defaults to 'admin' for development.
   */
  readonly currentRole = signal<ErpRole>(
    (sessionStorage.getItem(this.ROLE_KEY) as ErpRole) ?? 'admin'
  );

  /** Derived: full user object — dynamically populated from login response */
  readonly currentUser = computed<ErpUser>(() => {
    const userStr = sessionStorage.getItem('erp_temp_user_data');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        return {
          id: u.id || 'usr_temp',
          name: u.name || 'Administrator',
          email: u.email || 'admin@school.erp',
          role: this.currentRole()
        };
      } catch {
        // fallback if parse fails
      }
    }
    return {
      id: 'usr_temp',
      name: 'Administrator',
      email: 'admin@school.erp',
      role: this.currentRole()
    };
  });

  /** Convenience helpers for template role-checks */
  readonly isAdmin = computed(() => this.currentRole() === 'admin');
  readonly isPrincipal = computed(() => this.currentRole() === 'principal');
  readonly isTeacher = computed(() => this.currentRole() === 'teacher');
  readonly isParent = computed(() => this.currentRole() === 'parent');
  readonly isStudent = computed(() => this.currentRole() === 'student');
  readonly isHR = computed(() => this.currentRole() === 'hr');
  readonly isAccountant = computed(() => this.currentRole() === 'accountant');
  readonly activeSession = signal<string>(sessionStorage.getItem('erp_active_session') || '2026-27');
  readonly activeSessionId = signal<string>(sessionStorage.getItem('erp_active_session_id') || '');

  private apiService = inject(BaseApiService);

  constructor(private router: Router) {
    if (this.isAuthenticated()) {
      this.fetchActiveSession();
    }
  }

  fetchActiveSession() {
    this.apiService.get<any>('/attendance/students/setup').subscribe(res => {
      if (res.success && res.data?.academicSession) {
        const session = res.data.academicSession;
        const sessionId = res.data.academicSessionId || '';
        sessionStorage.setItem('erp_active_session', session);
        sessionStorage.setItem('erp_active_session_id', sessionId);
        this.activeSession.set(session);
        this.activeSessionId.set(sessionId);
      }
    });
  }

  private checkInitialState(): boolean {
    return sessionStorage.getItem(this.AUTH_KEY) === 'true';
  }

  getAccessToken(): string | null {
    return this._accessToken;
  }

  silentRefresh(): Observable<string> {
    if (this._refreshObservable) {
      return this._refreshObservable;
    }

    const refreshToken = sessionStorage.getItem('refreshToken');
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    this._refreshObservable = this.apiService.post<any>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken }).pipe(
      map((res: any) => {
        const newAccessToken = res?.data?.accessToken;
        if (newAccessToken) {
          this._accessToken = newAccessToken;
          return newAccessToken;
        }
        throw new Error('Refresh failed');
      }),
      catchError((err) => {
        this.logout();
        return throwError(() => err);
      }),
      finalize(() => {
        this._refreshObservable = null;
      }),
      shareReplay(1)
    );

    return this._refreshObservable;
  }

  login(email: string, password: string): Observable<any> {
    return this.apiService.post<any>(API_ENDPOINTS.AUTH.LOGIN, { email, password }).pipe(
      tap((res: any) => {
        const apiData = res?.data;

        // Store JWT tokens: Access Token strictly in-memory, Refresh Token in session storage
        if (apiData && apiData.accessToken) {
          this._accessToken = apiData.accessToken;
          sessionStorage.setItem('refreshToken', apiData.refreshToken);
        }

        // Store user and authentication state
        const rawRole = apiData?.user?.role || 'admin';
        const role = rawRole.toLowerCase() as ErpRole;

        sessionStorage.setItem(this.AUTH_KEY, 'true');
        sessionStorage.setItem(this.ROLE_KEY, role);
        if (apiData?.user) {
          sessionStorage.setItem('erp_temp_user_data', JSON.stringify({
            ...apiData.user,
            role: role // Normalize to lowercase ErpRole
          }));
        }

        this.isAuthenticated.set(true);
        this.currentRole.set(role);
        this.fetchActiveSession();
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.apiService.post<any>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this.apiService.post<any>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      newPassword,
      confirmPassword,
    });
  }

  getMe(): Observable<any> {
    return this.apiService.get<any>(API_ENDPOINTS.AUTH.ME).pipe(
      tap((res: any) => {
        const apiData = res?.data;
        if (apiData) {
          const rawRole = apiData.role || 'admin';
          const role = rawRole.toLowerCase() as ErpRole;

          // Sync local storage and reactive signals with latest user data from the server
          sessionStorage.setItem('erp_temp_user_data', JSON.stringify({
            ...apiData,
            role: role // Normalize to lowercase ErpRole
          }));

          this.currentRole.set(role);
          this.fetchActiveSession();
        }
      })
    );
  }

  logout() {
    const cleanup = () => {
      this._accessToken = null;
      sessionStorage.removeItem(this.AUTH_KEY);
      sessionStorage.removeItem(this.ROLE_KEY);
      sessionStorage.removeItem('erp_temp_user_data');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('erp_active_session');
      sessionStorage.removeItem('erp_active_session_id');
      this.isAuthenticated.set(false);
      this.router.navigate(['/erp/login']);
    };

    // Call server-side logout in background and ensure local session is cleared in either case
    this.apiService.post<any>(API_ENDPOINTS.AUTH.LOGOUT, {}).subscribe({
      next: () => cleanup(),
      error: () => cleanup()
    });
  }

  /** Used by SidebarComponent and guards for role checks */
  hasRole(roles: ErpRole[]): boolean {
    if (!roles || roles.length === 0) return true;
    return roles.includes(this.currentRole());
  }
}
