import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/api/base/base-api.service';
import { ApiResponse } from '../../../core/api/models/api-response.model';
import { API_ENDPOINTS } from '../../../core/api/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class ClassesHttpService extends BaseApiService {

  /**
   * Get all classes
   */
  getClasses(): Observable<ApiResponse<any[]>> {
    return this.get<ApiResponse<any[]>>(API_ENDPOINTS.CLASSES.BASE);
  }

  /**
   * Get a single class by ID (including student roster and subjects/teachers)
   */
  getClassById(id: string): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.CLASSES.DETAILS(id));
  }

  /**
   * Create a new class
   */
  createClass(data: { name: string; section: string; classTeacherId?: string }): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(API_ENDPOINTS.CLASSES.BASE, data);
  }

  /**
   * Update a class (name, section, classTeacherId)
   */
  updateClass(id: string, data: { name?: string; section?: string; classTeacherId?: string }): Observable<ApiResponse<any>> {
    return this.put<ApiResponse<any>>(API_ENDPOINTS.CLASSES.DETAILS(id), data);
  }

  /**
   * Delete a class
   */
  deleteClass(id: string): Observable<ApiResponse<any>> {
    return this.delete<ApiResponse<any>>(API_ENDPOINTS.CLASSES.DETAILS(id));
  }

  /**
   * Fetch all academic session years
   */
  getSessions(): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.FEES.SESSIONS);
  }

  /**
   * Define a new academic session year
   */
  createSession(data: { name: string; startDate: string; endDate: string; isActive: boolean }): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(API_ENDPOINTS.FEES.SESSIONS, data);
  }

  /**
   * Set an academic session year as active (archives/deactivates others)
   */
  activateSession(sessionId: string): Observable<ApiResponse<any>> {
    return this.patch<ApiResponse<any>>(API_ENDPOINTS.FEES.ACTIVATE_SESSION(sessionId), {});
  }
}
