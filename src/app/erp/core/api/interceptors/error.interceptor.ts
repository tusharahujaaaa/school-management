import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiErrorHandler } from '../handlers/error-handler.service';

/**
 * Global API error interceptor
 */
export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  
  const errorHandler = inject(ApiErrorHandler);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      errorHandler.handleError(error);
      return throwError(() => error);
    })
  );
};
