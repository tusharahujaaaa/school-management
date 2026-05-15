import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../core/api/base/base-api.service';
import { Observable, of, delay } from 'rxjs';
import { Student } from '../models/student.model';
import { MOCK_STUDENTS } from '../mock-data/students.mock';

@Injectable({ providedIn: 'root' })
export class StudentService extends BaseApiService {
  /**
   * Fetch all students (mocked for now)
   */
  getStudents(): Observable<Student[]> {
    // In a real implementation: return this.get<Student[]>('/students');
    return of(MOCK_STUDENTS).pipe(delay(500));
  }

  /**
   * Fetch student by ID (mocked for now)
   */
  getStudentById(id: string): Observable<Student | undefined> {
    const student = MOCK_STUDENTS.find(s => s.id === id);
    return of(student).pipe(delay(300));
  }
}
