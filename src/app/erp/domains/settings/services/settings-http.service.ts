import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/api/base/base-api.service';
import { ApiResponse } from '../../../core/api/models/api-response.model';
import { API_ENDPOINTS } from '../../../core/api/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class SettingsHttpService extends BaseApiService {

  /**
   * Get website config for the current logged-in school
   */
  getWebsiteConfig(): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.SETTINGS.WEBSITE);
  }

  /**
   * Update/save website config
   */
  saveWebsiteConfig(data: any): Observable<ApiResponse<any>> {
    return this.put<ApiResponse<any>>(API_ENDPOINTS.SETTINGS.WEBSITE, data);
  }
}
