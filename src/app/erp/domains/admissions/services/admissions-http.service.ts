import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/api/base/base-api.service';
import { ApiResponse } from '../../../core/api/models/api-response.model';
import { API_ENDPOINTS } from '../../../core/api/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class AdmissionsHttpService extends BaseApiService {

  /**
   * Submit a public admission inquiry form
   */
  submitInquiry(data: any): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(API_ENDPOINTS.ADMISSIONS.SUBMIT, data);
  }

  /**
   * Retrieve filtered list of admission inquiries (leads)
   */
  getLeads(filters?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.ADMISSIONS.BASE, filters);
  }

  /**
   * Update lead pipeline status and comments/notes
   */
  updateLeadStatus(leadId: string, data: { status: string; notes?: string }): Observable<ApiResponse<any>> {
    return this.patch<ApiResponse<any>>(API_ENDPOINTS.ADMISSIONS.DETAILS(leadId), data);
  }

  /**
   * Fetch school config/details by domain name (public lookup)
   */
  getPublicSchoolConfig(domain: string): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.ADMISSIONS.WEBSITE_PUBLIC(domain));
  }
}
