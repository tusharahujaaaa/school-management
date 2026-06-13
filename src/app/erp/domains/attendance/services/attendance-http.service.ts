import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/api/base/base-api.service';
import { ApiResponse } from '../../../core/api/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceHttpService extends BaseApiService {
  
  /**
   * Fetch attendance setup data (classes, sections)
   */
  getSetupData(): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>('/attendance/students/setup');
  }

  /**
   * Fetch attendance records by classId and date
   */
  getAttendanceByClassAndDate(classId: string, date: string): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(`/attendance/class/${classId}`, { date });
  }

  /**
   * Submit daily attendance records in bulk
   */
  submitBulkAttendance(classId: string, date: string, records: any[]): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>('/attendance/bulk', { classId, date, records });
  }

  /**
   * Fetch student attendance summary (monthly counts & overall percentage)
   */
  getStudentAttendanceSummary(studentId: string, month: number, year: number): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(`/attendance/student/${studentId}/summary`, { month, year });
  }

  /**
   * Fetch student attendance history records
   */
  getStudentAttendanceHistory(studentId: string, filters?: { startDate?: string; endDate?: string; status?: string }): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(`/attendance/student/${studentId}/history`, filters);
  }

  /**
   * Submit staff attendance records in bulk
   */
  submitStaffAttendance(date: string, records: any[]): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>('/attendance/staff', { date, records });
  }

  /**
   * Fetch staff attendance history logs
   */
  getStaffAttendanceHistory(filters?: { date?: string; dateFrom?: string; dateTo?: string; teacherId?: string }): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>('/attendance/staff/history', filters);
  }
}
