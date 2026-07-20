import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SearchResult } from '../models/global-search.model';

@Injectable({
  providedIn: 'root'
})
export class GlobalSearchService {
  
  search(query: string): Observable<SearchResult[]> {
    return of([]);
  }
}
