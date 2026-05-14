import { HttpParams } from '@angular/common/http';

export class ApiUtils {
  /**
   * Transforms a filter object into HttpParams
   */
  static toHttpParams(filters: any): HttpParams {
    let params = new HttpParams();
    if (!filters) return params;

    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => {
            params = params.append(key, v);
          });
        } else {
          params = params.set(key, value);
        }
      }
    });

    return params;
  }

  /**
   * Formats sorting parameters for backend (e.g., sort=name,asc)
   */
  static formatSort(field: string, order: 'asc' | 'desc'): string {
    return `${field},${order}`;
  }
}
