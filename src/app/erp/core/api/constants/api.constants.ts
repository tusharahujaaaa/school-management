/**
 * API Environment Configuration
 */
export const API_CONFIG = {
  // Use current window.location for dynamic base if needed, 
  // or hardcode for local dev
  baseUrl: 'http://localhost:8080/api', 
  version: 'v1',
  timeout: 30000, // 30 seconds
};

/**
 * Centralized API Endpoints
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  ATTENDANCE: {
    STUDENTS: '/attendance/students',
    STAFF: '/attendance/staff',
    SUMMARY: '/attendance/summary',
    HISTORY: '/attendance/history',
    SUBMIT: '/attendance/submit',
  },
  STUDENTS: {
    BASE: '/students',
    DETAILS: (id: string) => `/students/${id}`,
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    ALERTS: '/dashboard/alerts',
  }
};
