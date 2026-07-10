import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/api/base/base-api.service';
import { ApiResponse } from '../../../core/api/models/api-response.model';
import { API_ENDPOINTS } from '../../../core/api/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class SubjectsHttpService extends BaseApiService {

  getSubjects(filters?: { classId?: string }): Observable<ApiResponse<any[]>> {
    return this.get<ApiResponse<any[]>>(API_ENDPOINTS.SUBJECTS.BASE, filters);
  }

  createSubject(data: { name: string; classId: string; teacherId?: string | null }): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(API_ENDPOINTS.SUBJECTS.BASE, data);
  }

  updateSubject(id: string, data: { name?: string; classId?: string; teacherId?: string | null }): Observable<ApiResponse<any>> {
    return this.put<ApiResponse<any>>(API_ENDPOINTS.SUBJECTS.DETAILS(id), data);
  }

  deleteSubject(id: string): Observable<ApiResponse<any>> {
    return this.delete<ApiResponse<any>>(API_ENDPOINTS.SUBJECTS.DETAILS(id));
  }
}
