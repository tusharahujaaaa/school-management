import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/api/base/base-api.service';
import { ApiResponse } from '../../../core/api/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectsHttpService extends BaseApiService {

  getSubjects(filters?: { classId?: string }): Observable<ApiResponse<any[]>> {
    return this.get<ApiResponse<any[]>>('/subjects', filters);
  }

  createSubject(data: { name: string; classId: string; teacherId?: string | null }): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>('/subjects', data);
  }

  updateSubject(id: string, data: { name?: string; classId?: string; teacherId?: string | null }): Observable<ApiResponse<any>> {
    return this.put<ApiResponse<any>>(`/subjects/${id}`, data);
  }

  deleteSubject(id: string): Observable<ApiResponse<any>> {
    return this.delete<ApiResponse<any>>(`/subjects/${id}`);
  }
}
