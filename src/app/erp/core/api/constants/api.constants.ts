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
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    PROFILE: '/auth/profile',
    ME: '/auth/me',
  },
  ADMISSIONS: {
    BASE: '/admissions',
    DETAILS: (leadId: string) => `/admissions/${leadId}`,
    SUBMIT: '/admissions/submit',
    WEBSITE_PUBLIC: (domain: string) => `/website/public/${domain}`
  },
  ATTENDANCE: {
    ANALYTICS: '/attendance/analytics/students',
    BULK: '/attendance/bulk',
    CLASS_DATE: (classId: string) => `/attendance/class/${classId}`,
    REPORTS_DAILY: '/attendance/reports/daily',
    REPORTS_LOW: '/attendance/reports/low-attendance',
    REPORTS_MONTHLY: '/attendance/reports/monthly',
    STAFF: '/attendance/staff',
    STAFF_HISTORY: '/attendance/staff/history',
    STUDENT_HISTORY: (studentId: string) => `/attendance/student/${studentId}/history`,
    STUDENT_SUMMARY: (studentId: string) => `/attendance/student/${studentId}/summary`,
    STUDENTS_HISTORY: '/attendance/students/history',
    STUDENTS_SETUP: '/attendance/students/setup'
  },
  CLASSES: {
    BASE: '/classes',
    DETAILS: (id: string) => `/classes/${id}`,
  },
  DASHBOARD: {
    ADMIN_ATTENDANCE: '/dashboard/admin/attendance-overview',
    ADMIN_EVENTS: '/dashboard/admin/events',
    ADMIN_FEES: '/dashboard/admin/fee-overview',
    ADMIN_NOTIFICATIONS: '/dashboard/admin/notifications',
    ADMIN_ACTIVITIES: '/dashboard/admin/recent-activities',
    ADMIN_STATS: '/dashboard/admin/stats',
    STUDENT: '/dashboard/student',
    TEACHER: '/dashboard/teacher'
  },
  EXAMS: {
    BASE: '/exams',
    PUBLISH: (examId: string) => `/exams/${examId}/publish`,
    RESULTS: (examId: string) => `/exams/${examId}/results`,
    SUBJECTS: (examId: string) => `/exams/${examId}/subjects`,
    CONFIG_TYPES: '/exams/config/exam-types',
    CONFIG_GRADE_SCHEMES: '/exams/config/grade-schemes',
    CONFIG_RESULT_STATUSES: '/exams/config/result-statuses',
    CONFIG_WORKFLOW_STAGES: '/exams/config/workflow-stages',
    STUDENT_REPORT: (studentId: string, examId: string) => `/exams/students/${studentId}/exams/${examId}/report`,
    SUBJECT_MARKS: (examSubjectId: string) => `/exams/subjects/${examSubjectId}/marks`,
    SUBJECT_ROSTER: (examSubjectId: string) => `/exams/subjects/${examSubjectId}/roster`
  },
  FEES: {
    DASHBOARD: '/fees/dashboard',
    GENERATE: '/fees/generate',
    PROFILE: (studentId: string) => `/fees/profile/${studentId}`,
    RECORDS: '/fees/records',
    PAY: (recordId: string) => `/fees/records/${recordId}/pay`,
    WAIVE: (recordId: string) => `/fees/records/${recordId}/waive`,
    MARK_OVERDUE: '/fees/records/mark-overdue',
    SESSIONS: '/fees/sessions',
    ACTIVATE_SESSION: (sessionId: string) => `/fees/sessions/${sessionId}/activate`,
    STRUCTURE: '/fees/structure',
    STRUCTURE_DETAILS: (structureId: string) => `/fees/structure/${structureId}`,
    STUDENT_FEES: (studentId: string) => `/fees/student/${studentId}`
  },
  NOTIFICATIONS: {
    ADMIN: '/dashboard/admin/notifications'
  },
  SETTINGS: {
    WEBSITE: '/website'
  },
  STUDENTS: {
    BASE: '/students',
    DETAILS: (id: string) => `/students/${id}`,
    PHOTO: (id: string) => `/students/${id}/photo`,
    STATUS: (id: string) => `/students/${id}/status`,
    BUSES: '/students/buses'
  },
  SUBJECTS: {
    BASE: '/subjects',
    DETAILS: (id: string) => `/subjects/${id}`
  },
  TEACHERS: {
    BASE: '/teachers',
    DETAILS: (id: string) => `/teachers/${id}`
  }
};
