import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/api/base/base-api.service';
import { API_ENDPOINTS } from '../../../core/api/constants/api.constants';
import { 
  Student, StaffMember, StudentAttendanceRecord, StaffAttendanceRecord,
  AttendanceDashboardStats, ClassAttendanceSummary, AttendanceHistoryRecord
} from '../models/attendance.model';
import { ApiResponse } from '../../../core/api/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceHttpService extends BaseApiService {
  
  /**
   * Fetch students for marking attendance
   */
  getStudents(classId: string, section: string): Observable<Student[]> {
    return this.get<Student[]>(API_ENDPOINTS.ATTENDANCE.STUDENTS, { classId, section });
  }

  /**
   * Fetch staff members for marking attendance
   */
  getStaff(): Observable<StaffMember[]> {
    return this.get<StaffMember[]>(API_ENDPOINTS.ATTENDANCE.STAFF);
  }

  /**
   * Submit daily attendance records
   */
  submitAttendance(records: any[]): Observable<ApiResponse<void>> {
    return this.post<ApiResponse<void>>(API_ENDPOINTS.ATTENDANCE.SUBMIT, { records });
  }

  /**
   * Fetch attendance dashboard stats
   */
  getDashboardStats(): Observable<AttendanceDashboardStats> {
    return this.get<AttendanceDashboardStats>(API_ENDPOINTS.ATTENDANCE.SUMMARY);
  }

  /**
   * Fetch attendance history logs
   */
  getHistory(filters?: any): Observable<AttendanceHistoryRecord[]> {
    return this.get<AttendanceHistoryRecord[]>(API_ENDPOINTS.ATTENDANCE.HISTORY, filters);
  }
}
