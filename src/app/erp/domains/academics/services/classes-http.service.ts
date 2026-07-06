import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/api/base/base-api.service';
import { ApiResponse } from '../../../core/api/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ClassesHttpService extends BaseApiService {

  /**
   * Get all classes
   */
  getClasses(): Observable<ApiResponse<any[]>> {
    return this.get<ApiResponse<any[]>>('/classes');
  }

  /**
   * Get a single class by ID (including student roster and subjects/teachers)
   */
  getClassById(id: string): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(`/classes/${id}`);
  }

  /**
   * Create a new class
   */
  createClass(data: { name: string; section: string; classTeacherId?: string }): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>('/classes', data);
  }

  /**
   * Update a class (name, section, classTeacherId)
   */
  updateClass(id: string, data: { name?: string; section?: string; classTeacherId?: string }): Observable<ApiResponse<any>> {
    return this.put<ApiResponse<any>>(`/classes/${id}`, data);
  }

  /**
   * Delete a class
   */
  deleteClass(id: string): Observable<ApiResponse<any>> {
    return this.delete<ApiResponse<any>>(`/classes/${id}`);
  }

  /**
   * Fetch all academic session years
   */
  getSessions(): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>('/fees/sessions');
  }

  /**
   * Define a new academic session year
   */
  createSession(data: { name: string; startDate: string; endDate: string; isActive: boolean }): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>('/fees/sessions', data);
  }

  /**
   * Set an academic session year as active (archives/deactivates others)
   */
  activateSession(sessionId: string): Observable<ApiResponse<any>> {
    return this.patch<ApiResponse<any>>(`/fees/sessions/${sessionId}/activate`, {});
  }
}
