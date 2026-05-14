import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Attaches JWT token to every outgoing ERP API request
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  
  // Temporarily get token from localStorage or mock auth state
  // In a real app, this might come from an AuthService signal
  const token = localStorage.getItem('erp_token');
  
  // Only intercept requests to our API baseUrl
  if (token && req.url.includes('/api/')) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
