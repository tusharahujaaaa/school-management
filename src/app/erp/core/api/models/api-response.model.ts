/**
 * Standard API Response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

/**
 * Standard Paginated Response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

/**
 * Standard API Error Response
 */
export interface ApiErrorResponse {
  error: string;
  message: string;
  status: number;
  timestamp: string;
  path?: string;
  errors?: Record<string, string[]>; // For validation errors
}
