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
    return this.get<ApiResponse<any>>('/fees/structures');
  }

  /**
   * Create a new fee structure configuration
   */
  createFeeStructure(data: any): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>('/fees/structures', data);
  }

  /**
   * Run batch invoice generation for a structure
   */
  generateInvoices(structureId: string): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(`/fees/structures/${structureId}/generate`, {});
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
