import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { AuthService } from '../../../domains/auth/services/auth.service';

/**
 * Attaches JWT token to every outgoing ERP API request
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  
  // Avoid intercepting the refresh token request itself to prevent infinite loops
  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  // If access token is empty in-memory but user is authenticated in sessionStorage, perform silent refresh
  if (!token && sessionStorage.getItem('erp_temp_auth_state') === 'true') {
    return authService.silentRefresh().pipe(
      switchMap((newToken) => {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken}`
          }
        });
        return next(authReq);
      }),
      catchError(() => {
        // If refresh fails, proceed to let the server reject with 401
        return next(req);
      })
    );
  }

  // Attach bearer token if present in-memory
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
