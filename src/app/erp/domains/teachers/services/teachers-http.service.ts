import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/api/base/base-api.service';
import { ApiResponse } from '../../../core/api/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class TeachersHttpService extends BaseApiService {

  /**
   * Get all teachers
   */
  getTeachers(filters?: { search?: string }): Observable<ApiResponse<any[]>> {
    return this.get<ApiResponse<any[]>>('/teachers', filters);
  }

  /**
   * Get a single teacher by ID
   */
  getTeacherById(id: string): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(`/teachers/${id}`);
  }

  /**
   * Create a new teacher
   */
  createTeacher(data: any): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>('/teachers', data);
  }

  /**
   * Update a teacher
   */
  updateTeacher(id: string, data: any): Observable<ApiResponse<any>> {
    return this.put<ApiResponse<any>>(`/teachers/${id}`, data);
  }

  /**
   * Delete a teacher
   */
  deleteTeacher(id: string): Observable<ApiResponse<any>> {
    return this.delete<ApiResponse<any>>(`/teachers/${id}`);
  }
}
