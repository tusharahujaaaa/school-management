import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/api/base/base-api.service';
import { ApiResponse } from '../../../core/api/models/api-response.model';
import { API_ENDPOINTS } from '../../../core/api/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class AttendanceHttpService extends BaseApiService {
  
  /**
   * Fetch attendance setup data (classes, sections)
   */
  getSetupData(): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.ATTENDANCE.STUDENTS_SETUP);
  }

  /**
   * Fetch attendance records by classId and date
   */
  getAttendanceByClassAndDate(classId: string, date: string): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.ATTENDANCE.CLASS_DATE(classId), { date });
  }

  /**
   * Submit daily attendance records in bulk
   */
  submitBulkAttendance(classId: string, date: string, records: any[]): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(API_ENDPOINTS.ATTENDANCE.BULK, { classId, date, records });
  }

  /**
   * Fetch student attendance summary (monthly counts & overall percentage)
   */
  getStudentAttendanceSummary(studentId: string, month: number, year: number): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.ATTENDANCE.STUDENT_SUMMARY(studentId), { month, year });
  }

  /**
   * Fetch student attendance history records
   */
  getStudentAttendanceHistory(studentId: string, filters?: { startDate?: string; endDate?: string; status?: string }): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.ATTENDANCE.STUDENT_HISTORY(studentId), filters);
  }

  /**
   * Submit staff attendance records in bulk
   */
  submitStaffAttendance(date: string, records: any[]): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(API_ENDPOINTS.ATTENDANCE.STAFF, { date, records });
  }

  /**
   * Fetch staff attendance history logs
   */
  getStaffAttendanceHistory(filters?: { date?: string; dateFrom?: string; dateTo?: string; teacherId?: string }): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.ATTENDANCE.STAFF_HISTORY, filters);
  }

  /**
   * Fetch student attendance analytics (percentages, class trends, low attendance)
   */
  getStudentAnalytics(): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.ATTENDANCE.ANALYTICS);
  }

  /**
   * Fetch filtered student history records
   */
  getStudentHistoryFiltered(filters?: { date?: string; classId?: string; sectionId?: string; studentId?: string; status?: string; page?: number; limit?: number }): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.ATTENDANCE.STUDENTS_HISTORY, filters);
  }

  /**
   * Fetch daily student attendance report
   */
  getDailyReport(date: string): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.ATTENDANCE.REPORTS_DAILY, { date });
  }

  /**
   * Fetch monthly student attendance report
   */
  getMonthlyReport(month: number, year: number): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.ATTENDANCE.REPORTS_MONTHLY, { month, year });
  }

  /**
   * Fetch low attendance report below threshold
   */
  getLowAttendanceReport(threshold: number): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.ATTENDANCE.REPORTS_LOW, { threshold });
  }
}
