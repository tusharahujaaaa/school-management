import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../core/api/base/base-api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/api/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class StudentService extends BaseApiService {
  
  /**
   * Fetch students with backend filtering
   */
  getStudentsList(filters?: { classId?: string; status?: string; search?: string }): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>('/students', filters);
  }

  /**
   * Fetch detailed student profile by ID
   */
  getStudentById(id: string): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(`/students/${id}`);
  }

  /**
   * Create a new student record
   */
  createStudent(data: any): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>('/students', data);
  }

  /**
   * Update student record
   */
  updateStudent(id: string, data: any): Observable<ApiResponse<any>> {
    return this.put<ApiResponse<any>>(`/students/${id}`, data);
  }

  /**
   * Update a student's profile photo URL.
   */
  uploadStudentPhoto(id: string, photoUrl: string): Observable<ApiResponse<any>> {
    return this.patch<ApiResponse<any>>(`/students/${id}/photo`, { photoUrl });
  }

  /**
   * Update student status
   */
  updateStudentStatus(id: string, status: string): Observable<ApiResponse<any>> {
    return this.patch<ApiResponse<any>>(`/students/${id}/status`, { status });
  }

  /**
   * Fetch student setup options (classes & sections)
   */
  getSetupData(): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>('/attendance/students/setup');
  }

  /**
   * Fetch active transport bus routes
   */
  getBuses(): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>('/students/buses');
  }
}
