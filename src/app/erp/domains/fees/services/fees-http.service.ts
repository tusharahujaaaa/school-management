import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/api/base/base-api.service';
import { ApiResponse } from '../../../core/api/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class FeesHttpService extends BaseApiService {

  /**
   * Fetch all fee structure templates
   */
  getFeeStructures(): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>('/fees/structure');
  }

  /**
   * Create a new fee structure configuration
   */
  createFeeStructure(data: any): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>('/fees/structure', data);
  }

  /**
   * Update an existing fee structure configuration
   */
  updateFeeStructure(structureId: string, data: any): Observable<ApiResponse<any>> {
    return this.put<ApiResponse<any>>(`/fees/structure/${structureId}`, data);
  }

  /**
   * Delete a fee structure configuration
   */
  deleteFeeStructure(structureId: string): Observable<ApiResponse<any>> {
    return this.delete<ApiResponse<any>>(`/fees/structure/${structureId}`);
  }

  /**
   * Run parametric batch invoice generation
   */
  generateInvoices(payload: { sessionId: string; classId?: string; feeType: string; month: number; year: number }): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>('/fees/generate', payload);
  }

  /**
   * Fetch active session years
   */
  getSessions(): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>('/fees/sessions');
  }

  /**
   * Define a new session year
   */
  createSession(data: any): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>('/fees/sessions', data);
  }

  /**
   * Set a session year as active
   */
  activateSession(sessionId: string): Observable<ApiResponse<any>> {
    return this.patch<ApiResponse<any>>(`/fees/sessions/${sessionId}/activate`, {});
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
    return this.get<ApiResponse<any>>('/fees/records', filters);
  }

  /**
   * Record manual payment details
   */
  payFeeRecord(recordId: string, data: { paymentMode: string; paidDate: string; remarks?: string }): Observable<ApiResponse<any>> {
    return this.patch<ApiResponse<any>>(`/fees/records/${recordId}/pay`, data);
  }

  /**
   * Waive an individual fee record
   */
  waiveFeeRecord(recordId: string, remarks?: string): Observable<ApiResponse<any>> {
    return this.patch<ApiResponse<any>>(`/fees/records/${recordId}/waive`, { remarks });
  }

  /**
   * Fetch a student's session-specific fee profile (discounts, waivers)
   */
  getStudentFeeProfile(studentId: string, sessionId?: string): Observable<ApiResponse<any>> {
    const params = sessionId ? { sessionId } : undefined;
    return this.get<ApiResponse<any>>(`/fees/profile/${studentId}`, params);
  }

  /**
   * Create or update student fee profile (apply discounts or session waiver)
   */
  upsertStudentFeeProfile(studentId: string, data: any): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(`/fees/profile/${studentId}`, data);
  }

  /**
   * Fetch aggregate collections data and recent transactions
   */
  getFeeDashboard(): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>('/fees/dashboard');
  }

  /**
   * Retrieve ledger containing payment schedules of a single student
   */
  getStudentLedger(studentId: string): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(`/fees/student/${studentId}`);
  }
}

