import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchResult } from '../models/global-search.model';
import { BaseApiService } from '../../../../core/api/base/base-api.service';
import { API_ENDPOINTS } from '../../../../core/api/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class GlobalSearchService extends BaseApiService {
  
  search(query: string): Observable<SearchResult[]> {
    const trimmed = (query || '').trim();
    if (trimmed.length < 2) {
      return of([]);
    }

    return this.get<any>(API_ENDPOINTS.SEARCH.BASE, { q: trimmed }).pipe(
      map(res => {
        if (res?.success && Array.isArray(res.data)) {
          return res.data;
        }
        return [];
      })
    );
  }
}
