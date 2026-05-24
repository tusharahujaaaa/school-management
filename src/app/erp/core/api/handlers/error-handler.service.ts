import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ApiErrorResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApiErrorHandler {
  // PrimeNG message service for global toasts
  private messageService = inject(MessageService);

  /**
   * Centralized error handling logic
   */
  handleError(error: HttpErrorResponse): void {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      const apiError = error.error as ApiErrorResponse;
      
      switch (error.status) {
        case 401:
          errorMessage = 'Unauthorized: Please login again.';
          // Redirect to login logic would go here
          break;
        case 403:
          errorMessage = 'Forbidden: You do not have permission.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 500:
          errorMessage = 'Internal Server Error. Please try again later.';
          break;
        case 0:
          errorMessage = 'Network error: Check your internet connection.';
          break;
        default:
          errorMessage = apiError?.message || error.message || errorMessage;
      }
    }

    // Standard User Feedback
    this.messageService.add({
      severity: 'error',
      summary: 'API Error',
      detail: errorMessage,
      life: 5000
    });

    console.error(`[API ERROR ${error.status}]:`, error);
  }
}
