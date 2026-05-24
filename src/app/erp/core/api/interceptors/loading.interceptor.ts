import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

/**
 * Automatically tracks request loading states
 */
export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  
  const loadingService = inject(LoadingService);
  
  // Start loading
  loadingService.setLoading(true, req.url);

  return next(req).pipe(
    finalize(() => {
      // Stop loading regardless of success or error
      loadingService.setLoading(false, req.url);
    })
  );
};
