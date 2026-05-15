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
    academicSession: '2024-25',
    searchTerm: ''
  });
  private _selectedStudentId = signal<string | null>(null);

  // Selectors
  readonly students = this._students.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly filters = this._filters.asReadonly();
  readonly selectedStudentId = this._selectedStudentId.asReadonly();

  readonly filteredStudents = computed(() => {
    const students = this._students();
    const filters = this._filters();
    
    return students.filter(student => {
      const matchesClass = !filters.class || student.class === filters.class;
      const matchesSection = !filters.section || student.section === filters.section;
      const matchesGender = !filters.gender || student.gender === filters.gender;
      const matchesStatus = !filters.status || student.status === filters.status;
      const matchesSearch = !filters.searchTerm || 
        student.fullName.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(filters.searchTerm!.toLowerCase());
      
      return matchesClass && matchesSection && matchesGender && matchesStatus && matchesSearch;
    });
  });

  readonly selectedStudent = computed(() => {
    const id = this._selectedStudentId();
    if (!id) return null;
    return this._students().find(s => s.id === id) || null;
  });

  // Actions
  loadStudents() {
    this._loading.set(true);
    this.studentService.getStudents()
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (students) => this._students.set(students),
        error: (err) => console.error('Error loading students', err)
      });
  }

  updateFilters(filters: Partial<StudentFilters>) {
    this._filters.update(f => ({ ...f, ...filters }));
  }

  selectStudent(id: string | null) {
    this._selectedStudentId.set(id);
    if (id && !this.selectedStudent()) {
        // If student not in list, fetch it
        this._loading.set(true);
        this.studentService.getStudentById(id)
            .pipe(finalize(() => this._loading.set(false)))
            .subscribe({
                next: (student) => {
                    if (student) {
                        this._students.update(prev => [...prev, student]);
                    }
                }
            });
    }
  }
}
