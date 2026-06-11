import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/api/base/base-api.service';
import { ApiResponse } from '../../../core/api/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsHttpService extends BaseApiService {

  /**
   * Get website config for the current logged-in school
   */
  getWebsiteConfig(): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>('/website');
  }

  /**
   * Update/save website config
   */
  saveWebsiteConfig(data: any): Observable<ApiResponse<any>> {
    return this.put<ApiResponse<any>>('/website', data);
  }
}
