import { Injectable, signal, inject } from '@angular/core';
import { ClassesHttpService } from './classes-http.service';
import { catchError, of, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  private httpSvc = inject(ClassesHttpService);

  readonly loading = signal<boolean>(false);
  readonly classes = signal<any[]>([]);
  readonly activeClassDetail = signal<any | null>(null);

  /**
   * Load classes list from backend
   */
  loadClasses() {
    this.loading.set(true);
    this.httpSvc.getClasses().pipe(
      catchError((err) => {
        console.error('Error loading classes list:', err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe((res: any) => {
      if (res?.success && Array.isArray(res.data)) {
        this.classes.set(res.data);
      } else {
        this.classes.set([]);
      }
    });
  }

  /**
   * Load a class detail with roster and subjects
   */
  loadClassDetail(id: string) {
    this.loading.set(true);
    this.activeClassDetail.set(null);
    this.httpSvc.getClassById(id).pipe(
      catchError((err) => {
        console.error('Error loading class details:', err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe((res: any) => {
      if (res?.success && res.data) {
        this.activeClassDetail.set(res.data);
      } else {
        this.activeClassDetail.set(null);
      }
    });
  }

  /**
   * Create a new class
   */
  createClass(data: { name: string; section: string; classTeacherId?: string }) {
    this.loading.set(true);
    return this.httpSvc.createClass(data).pipe(
      finalize(() => this.loading.set(false))
    );
  }

  /**
   * Update a class
   */
  updateClass(id: string, data: { name?: string; section?: string; classTeacherId?: string }) {
    this.loading.set(true);
    return this.httpSvc.updateClass(id, data).pipe(
      finalize(() => this.loading.set(false))
    );
  }

  /**
   * Delete a class
   */
  deleteClass(id: string) {
    this.loading.set(true);
    return this.httpSvc.deleteClass(id).pipe(
      finalize(() => this.loading.set(false))
    );
  }

  // ─── Academic Sessions States ─────────────────────
  readonly sessions = signal<any[]>([]);
  readonly activeSession = signal<any | null>(null);

  /**
   * Load all academic sessions from backend
   */
  loadSessions() {
    this.loading.set(true);
    this.httpSvc.getSessions().pipe(
      catchError((err) => {
        console.error("Error loading academic sessions:", err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe((res: any) => {
      if (res?.success && Array.isArray(res.data)) {
        this.sessions.set(res.data);
        const active = res.data.find((s: any) => s.isActive);
        this.activeSession.set(active || null);
      } else {
        this.sessions.set([]);
        this.activeSession.set(null);
      }
    });
  }

  /**
   * Create a new academic session year
   */
  createSession(data: { name: string; startDate: string; endDate: string; isActive: boolean }) {
    this.loading.set(true);
    return this.httpSvc.createSession(data).pipe(
      finalize(() => this.loading.set(false))
    );
  }

  /**
   * Set an academic session year as active (archives others)
   */
  activateSession(sessionId: string) {
    this.loading.set(true);
    return this.httpSvc.activateSession(sessionId).pipe(
      finalize(() => this.loading.set(false))
    );
  }
}
