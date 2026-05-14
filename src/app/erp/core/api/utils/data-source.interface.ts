import { Observable } from 'rxjs';

/**
 * Strategy pattern interface for API data sources.
 * Allows switching between Mock and Real HTTP implementations.
 */
export interface IDataSource<T> {
  getAll(params?: any): Observable<T[]>;
  getById(id: string | number): Observable<T>;
  create(item: T): Observable<T>;
  update(id: string | number, item: Partial<T>): Observable<T>;
  delete(id: string | number): Observable<void>;
}

/**
 * Type to define available data source providers
 */
export type DataSourceProvider = 'MOCK' | 'HTTP';
