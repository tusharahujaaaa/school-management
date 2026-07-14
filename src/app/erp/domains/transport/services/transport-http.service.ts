import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/api/base/base-api.service';
import { ApiResponse } from '../../../core/api/models/api-response.model';
import { API_ENDPOINTS } from '../../../core/api/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class TransportHttpService extends BaseApiService {

  /**
   * Get all buses
   */
  getBuses(): Observable<ApiResponse<any[]>> {
    return this.get<ApiResponse<any[]>>(API_ENDPOINTS.TRANSPORT.BUSES);
  }

  /**
   * Get a single bus by ID
   */
  getBusById(id: string): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.TRANSPORT.DETAILS(id));
  }

  /**
   * Create a new bus
   */
  createBus(data: any): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(API_ENDPOINTS.TRANSPORT.BUSES, data);
  }

  /**
   * Update an existing bus
   */
  updateBus(id: string, data: any): Observable<ApiResponse<any>> {
    return this.put<ApiResponse<any>>(API_ENDPOINTS.TRANSPORT.DETAILS(id), data);
  }

  /**
   * Delete a bus
   */
  deleteBus(id: string): Observable<ApiResponse<any>> {
    return this.delete<ApiResponse<any>>(API_ENDPOINTS.TRANSPORT.DETAILS(id));
  }

  /**
   * Get all assignments for a specific bus
   */
  getBusAssignments(id: string): Observable<ApiResponse<any[]>> {
    return this.get<ApiResponse<any[]>>(API_ENDPOINTS.TRANSPORT.ASSIGNMENTS(id));
  }
}
