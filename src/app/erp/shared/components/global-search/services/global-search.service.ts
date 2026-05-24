import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { SearchResult } from '../models/global-search.model';
import { MOCK_SEARCH_DATA } from '../mock-data/global-search.mock';

@Injectable({
  providedIn: 'root'
})
export class GlobalSearchService {
  
  search(query: string): Observable<SearchResult[]> {
    if (!query || query.trim().length === 0) {
      return of([]);
    }

    const lowerQuery = query.toLowerCase().trim();
    
    // Simulate network delay and filter
    const results = MOCK_SEARCH_DATA.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) || 
      item.entityId.toLowerCase().includes(lowerQuery)
    );

    return of(results).pipe(delay(300));
  }
}
