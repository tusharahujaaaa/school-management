import { environment } from '@/environments/environment';

/**
 * API Environment Configuration
 */
export const API_CONFIG = {
  baseUrl: environment.apiUrl, 
  version: '',
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
