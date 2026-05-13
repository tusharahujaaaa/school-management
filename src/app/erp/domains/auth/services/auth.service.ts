import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ErpRole } from '../../../shared/types/erp.types';

export interface ErpUser {
  id: string;
  name: string;
  email: string;
  role: ErpRole;
  avatar?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly AUTH_KEY = 'erp_temp_auth_state';
  private readonly ROLE_KEY = 'erp_temp_role';

  // ─── Auth state ──────────────────────────────────────────
  readonly isAuthenticated = signal<boolean>(this.checkInitialState());

  // ─── Current role (Signals-based) ────────────────────────
  /**
   * Temporary: reads role from localStorage.
   * Replace with JWT-decoded role once backend is ready.
   * Defaults to 'admin' for development.
   */
  readonly currentRole = signal<ErpRole>(
    (localStorage.getItem(this.ROLE_KEY) as ErpRole) ?? 'admin'
  );

  /** Derived: full user object — expand once real auth is integrated */
  readonly currentUser = computed<ErpUser>(() => ({
    id: 'usr_temp',
    name: 'Administrator',
    email: 'admin@school.erp',
    role: this.currentRole()
  }));

  /** Convenience helpers for template role-checks */
  readonly isAdmin = computed(() => this.currentRole() === 'admin');
  readonly isPrincipal = computed(() => this.currentRole() === 'principal');
  readonly isTeacher = computed(() => this.currentRole() === 'teacher');
  readonly isParent = computed(() => this.currentRole() === 'parent');
  readonly isStudent = computed(() => this.currentRole() === 'student');
  readonly isHR = computed(() => this.currentRole() === 'hr');
  readonly isAccountant = computed(() => this.currentRole() === 'accountant');

  constructor(private router: Router) { }

  private checkInitialState(): boolean {
    return localStorage.getItem(this.AUTH_KEY) === 'true';
  }

  login(role: ErpRole = 'admin') {
    localStorage.setItem(this.AUTH_KEY, 'true');
    localStorage.setItem(this.ROLE_KEY, role);
    this.isAuthenticated.set(true);
    this.currentRole.set(role);
    this.router.navigate(['/erp/dashboard']);
  }

  logout() {
    localStorage.removeItem(this.AUTH_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    this.isAuthenticated.set(false);
    this.router.navigate(['/erp/login']);
  }

  /** Used by SidebarComponent and guards for role checks */
  hasRole(roles: ErpRole[]): boolean {
    if (!roles || roles.length === 0) return true;
    return roles.includes(this.currentRole());
  }
}
