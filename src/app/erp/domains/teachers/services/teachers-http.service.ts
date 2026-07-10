import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/api/base/base-api.service';
import { ApiResponse } from '../../../core/api/models/api-response.model';
import { API_ENDPOINTS } from '../../../core/api/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class TeachersHttpService extends BaseApiService {

  /**
   * Get all teachers
   */
  getTeachers(filters?: { search?: string }): Observable<ApiResponse<any[]>> {
    return this.get<ApiResponse<any[]>>(API_ENDPOINTS.TEACHERS.BASE, filters);
  }

  /**
   * Get a single teacher by ID
   */
  getTeacherById(id: string): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.TEACHERS.DETAILS(id));
  }

  /**
   * Create a new teacher
   */
  createTeacher(data: any): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(API_ENDPOINTS.TEACHERS.BASE, data);
  }

  /**
   * Update a teacher
   */
  updateTeacher(id: string, data: any): Observable<ApiResponse<any>> {
    return this.put<ApiResponse<any>>(API_ENDPOINTS.TEACHERS.DETAILS(id), data);
  }

  /**
   * Delete a teacher
   */
  deleteTeacher(id: string): Observable<ApiResponse<any>> {
    return this.delete<ApiResponse<any>>(API_ENDPOINTS.TEACHERS.DETAILS(id));
  }
}
