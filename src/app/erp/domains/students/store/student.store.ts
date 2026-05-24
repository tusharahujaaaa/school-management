import { Injectable, signal, computed, inject } from '@angular/core';
import { Student, StudentFilters } from '../models/student.model';
import { StudentService } from '../services/student.service';
import { finalize } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StudentStore {
  private studentService = inject(StudentService);

  // State
  private _students = signal<Student[]>([]);
  private _loading = signal<boolean>(false);
  private _filters = signal<StudentFilters>({
    class: undefined,
    section: undefined,
    gender: undefined,
    status: undefined,
    academicSession: `${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(-2)}`,
    searchTerm: ''
  });
  private _selectedStudentId = signal<string | null>(null);

  // Dynamic dropdown assets from backend
  private _allClasses = signal<any[]>([]);
  readonly classes = signal<string[]>([]);
  readonly sections = signal<string[]>([]);

  // Selectors
  readonly students = this._students.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly filters = this._filters.asReadonly();
  readonly selectedStudentId = this._selectedStudentId.asReadonly();

  readonly filteredStudents = computed(() => {
    // Server-side filtered. No additional client filtering required.
    return this._students();
  });

  readonly selectedStudent = computed(() => {
    const id = this._selectedStudentId();
    if (!id) return null;
    return this._students().find(s => s.id === id) || null;
  });

  constructor() {
    this.loadSetupData();
  }

  // ─── Setup Loading ─────────────────────────────────
  loadSetupData() {
    this.studentService.getSetupData().subscribe({
      next: (res) => {
        const data = res?.data;
        if (data) {
          this._allClasses.set(data.classes || []);
          this.sections.set(data.sections || []);

          const uniqueClasses = [...new Set((data.classes || []).map((c: any) => c.name))] as string[];
          this.classes.set(uniqueClasses);

          // Update academicSession dynamically from backend config if present
          if (data.academicSession) {
            this._filters.update(f => ({ ...f, academicSession: data.academicSession }));
          }
        }
      }
    });
  }

  getClassId(className: string, sectionName: string): string | null {
    const cls = this._allClasses().find(c => c.name === className && c.section === sectionName);
    return cls ? cls.id : null;
  }

  // ─── Actions ──────────────────────────────────────
  loadStudents() {
    this._loading.set(true);
    const filters = this._filters();

    let classId: string | undefined = undefined;
    if (filters.class) {
      const cls = this._allClasses().find(c => 
        c.name === filters.class && (!filters.section || c.section === filters.section)
      );
      classId = cls?.id;
    }

    const status = filters.status ? filters.status.toUpperCase() : undefined;
    const search = filters.searchTerm || undefined;

    this.studentService.getStudentsList({ classId, status, search })
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (res: any) => {
          const rawStudents = res?.data?.data || res?.data || [];
          
          const mappedStudents: Student[] = rawStudents.map((item: any) => {
            const nameParts = (item.name || 'Student').split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ') || '';

            return {
              id: item.id,
              firstName,
              lastName,
              fullName: item.name || 'Student',
              gender: item.gender ? (item.gender.charAt(0) + item.gender.slice(1).toLowerCase() as any) : 'Male',
              admissionNumber: item.rollNumber || '',
              rollNumber: item.rollNumber || '',
              academicSession: filters.academicSession || '2026-27',
              class: item.class?.name || '',
              section: item.class?.section || '',
              status: item.status ? (item.status.charAt(0) + item.status.slice(1).toLowerCase() as any) : 'Active',
              contactNumber: item.parentPhone || '',
              email: item.parentEmail || '',
              address: item.address || '',
              parentName: item.parentName || '',
              photoUrl: item.photoUrl || ''
            };
          });

          this._students.set(mappedStudents);
        },
        error: (err) => console.error('Error loading students', err)
      });
  }

  updateFilters(filters: Partial<StudentFilters>) {
    this._filters.update(f => ({ ...f, ...filters }));
    this.loadStudents();
  }

  selectStudent(id: string | null) {
    this._selectedStudentId.set(id);
    if (id) {
        this._loading.set(true);
        this.studentService.getStudentById(id)
            .pipe(finalize(() => this._loading.set(false)))
            .subscribe({
                next: (res: any) => {
                    const item = res?.data;
                    if (item) {
                        const nameParts = (item.name || '').split(' ');
                        const firstName = nameParts[0];
                        const lastName = nameParts.slice(1).join(' ') || '';

                        const student: Student = {
                          id: item.id,
                          firstName,
                          lastName,
                          fullName: item.name || '',
                          gender: item.gender ? (item.gender.charAt(0) + item.gender.slice(1).toLowerCase() as any) : 'Male',
                          admissionNumber: item.rollNumber || '',
                          rollNumber: item.rollNumber || '',
                          academicSession: '2026-27',
                          class: item.class?.name || '',
                          section: item.class?.section || '',
                          status: item.status ? (item.status.charAt(0) + item.status.slice(1).toLowerCase() as any) : 'Active',
                          contactNumber: item.parentPhone || '',
                          email: item.parentEmail || '',
                          address: item.address || '',
                          parentName: item.parentName || '',
                          photoUrl: item.photoUrl || ''
                        };

                        this._students.update(prev => {
                          const index = prev.findIndex(s => s.id === id);
                          if (index >= 0) {
                            const updated = [...prev];
                            updated[index] = student;
                            return updated;
                          }
                          return [...prev, student];
                        });
                    }
                }
            });
    }
  }
}
