import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/api/base/base-api.service';
import { ApiResponse } from '../../../core/api/models/api-response.model';
import { API_ENDPOINTS } from '../../../core/api/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class FeesHttpService extends BaseApiService {

  /**
   * Fetch all fee structure templates
   */
  getFeeStructures(): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.FEES.STRUCTURE);
  }

  /**
   * Create a new fee structure configuration
   */
  createFeeStructure(data: any): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(API_ENDPOINTS.FEES.STRUCTURE, data);
  }

  /**
   * Update an existing fee structure configuration
   */
  updateFeeStructure(structureId: string, data: any): Observable<ApiResponse<any>> {
    return this.put<ApiResponse<any>>(API_ENDPOINTS.FEES.STRUCTURE_DETAILS(structureId), data);
  }

  /**
   * Delete a fee structure configuration
   */
  deleteFeeStructure(structureId: string): Observable<ApiResponse<any>> {
    return this.delete<ApiResponse<any>>(API_ENDPOINTS.FEES.STRUCTURE_DETAILS(structureId));
  }

  /**
   * Run parametric batch invoice generation
   */
  generateInvoices(payload: { sessionId: string; classId?: string; feeType: string; month: number; year: number }): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(API_ENDPOINTS.FEES.GENERATE, payload);
  }

  /**
   * Fetch active session years
   */
  getSessions(): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.FEES.SESSIONS);
  }

  /**
   * Define a new session year
   */
  createSession(data: any): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(API_ENDPOINTS.FEES.SESSIONS, data);
  }

  /**
   * Set a session year as active
   */
  activateSession(sessionId: string): Observable<ApiResponse<any>> {
    return this.patch<ApiResponse<any>>(API_ENDPOINTS.FEES.ACTIVATE_SESSION(sessionId), {});
  }

  /**
   * Retrieve filtered list of transaction invoices
   */
  getFeeRecords(filters?: { 
    studentId?: string; 
    status?: string; 
    feeType?: string; 
    month?: string; 
    page?: number; 
    limit?: number 
  }): Observable<ApiResponse<any>> {
    console.log('Fetching fee records with filters:', filters);
    return this.get<ApiResponse<any>>(API_ENDPOINTS.FEES.RECORDS, filters);
  }

  /**
   * Scan outstanding fee records and mark past-due pending invoices as overdue.
   */
  markOverdueRecords(sessionId?: string): Observable<ApiResponse<{ updated: number }>> {
    return this.post<ApiResponse<{ updated: number }>>(API_ENDPOINTS.FEES.MARK_OVERDUE, { sessionId });
  }

  /**
   * Record manual payment details
   */
  payFeeRecord(recordId: string, data: { paymentMode: string; paidDate: string; remarks?: string }): Observable<ApiResponse<any>> {
    return this.patch<ApiResponse<any>>(API_ENDPOINTS.FEES.PAY(recordId), data);
  }

  /**
   * Waive an individual fee record
   */
  waiveFeeRecord(recordId: string, remarks?: string): Observable<ApiResponse<any>> {
    return this.patch<ApiResponse<any>>(API_ENDPOINTS.FEES.WAIVE(recordId), { remarks });
  }

  /**
   * Fetch a student's session-specific fee profile (discounts, waivers)
   */
  getStudentFeeProfile(studentId: string, sessionId?: string): Observable<ApiResponse<any>> {
    const params = sessionId ? { sessionId } : undefined;
    return this.get<ApiResponse<any>>(API_ENDPOINTS.FEES.PROFILE(studentId), params);
  }

  /**
   * Create or update student fee profile (apply discounts or session waiver)
   */
  upsertStudentFeeProfile(studentId: string, data: any): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(API_ENDPOINTS.FEES.PROFILE(studentId), data);
  }

  /**
   * Fetch aggregate collections data and recent transactions
   */
  getFeeDashboard(): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.FEES.DASHBOARD);
  }

  /**
   * Retrieve ledger containing payment schedules of a single student
   */
  getStudentLedger(studentId: string): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.FEES.STUDENT_FEES(studentId));
  }
}
