import { Injectable, signal, inject } from '@angular/core';
import { TeachersHttpService } from './teachers-http.service';
import { catchError, of, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeachersService {
  private httpSvc = inject(TeachersHttpService);

  readonly loading = signal<boolean>(false);
  readonly teachers = signal<any[]>([]);
  readonly searchQuery = signal<string>('');

  /**
   * Load teachers from backend
   */
  loadTeachers() {
    this.loading.set(true);

    const filters = {
      search: this.searchQuery() || undefined
    };

    this.httpSvc.getTeachers(filters).pipe(
      catchError((err) => {
        console.error('Error loading teachers list:', err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe((res: any) => {
      if (res?.success && Array.isArray(res.data)) {
        this.teachers.set(res.data);
      } else {
        this.teachers.set([]);
      }
    });
  }

  /**
   * Create a new teacher
   */
  createTeacher(data: any) {
    this.loading.set(true);
    return this.httpSvc.createTeacher(data).pipe(
      finalize(() => this.loading.set(false))
    );
  }

  /**
   * Update an existing teacher
   */
  updateTeacher(id: string, data: any) {
    this.loading.set(true);
    return this.httpSvc.updateTeacher(id, data).pipe(
      finalize(() => this.loading.set(false))
    );
  }

  /**
   * Delete a teacher
   */
  deleteTeacher(id: string) {
    this.loading.set(true);
    return this.httpSvc.deleteTeacher(id).pipe(
      finalize(() => this.loading.set(false))
    );
  }
}
