/**
 * Centralized Permission Constants
 * Use these across the app instead of hardcoded strings
 */
export const ERP_PERMISSIONS = {
  DASHBOARD: {
    VIEW: 'dashboard.view',
  },
  ATTENDANCE: {
    VIEW: 'attendance.view',
    CREATE: 'attendance.create',
    EDIT: 'attendance.edit',
    DELETE: 'attendance.delete',
    EXPORT: 'attendance.export',
    REPORTS: 'attendance.reports',
    DASHBOARD: 'attendance.dashboard',
    STUDENTS_MARK: 'attendance.students.mark',
    STAFF_MARK: 'attendance.staff.mark',
    HISTORY_VIEW: 'attendance.history.view',
    REPORTS_VIEW: 'attendance.reports.view',
    TEACHER_MARK: 'attendance.teacher.mark',
    TEACHER_HISTORY: 'attendance.teacher.history',
    PARENT_VIEW: 'attendance.parent.view',
    STUDENT_VIEW: 'attendance.student.view',
  },
  STUDENTS: {
    VIEW: 'students.view',
    CREATE: 'students.create',
    EDIT: 'students.edit',
    DELETE: 'students.delete',
  },
  STAFF: {
    VIEW: 'staff.view',
    CREATE: 'staff.create',
    EDIT: 'staff.edit',
    DELETE: 'staff.delete',
  },
  FEES: {
    VIEW: 'fees.view',
    COLLECT: 'fees.collect',
    REPORTS: 'fees.reports',
  },
  SETTINGS: {
    VIEW: 'settings.view',
    EDIT: 'settings.edit',
  },
  NOTIFICATIONS: {
    VIEW: 'notifications.view',
  },
  ADMISSIONS: {
    VIEW: 'admissions.view',
    CREATE: 'admissions.create',
    BULK_IMPORT: 'admissions.bulk_import',
    PRINT: 'admissions.print',
  },
  ACADEMICS: {
    VIEW: 'academics.view',
    EDIT: 'academics.edit',
  }
} as const;

export type ErpPermission = 
  | typeof ERP_PERMISSIONS.DASHBOARD.VIEW
  | typeof ERP_PERMISSIONS.ATTENDANCE.VIEW
  | typeof ERP_PERMISSIONS.ATTENDANCE.CREATE
  | typeof ERP_PERMISSIONS.ATTENDANCE.EDIT
  | typeof ERP_PERMISSIONS.ATTENDANCE.DELETE
  | typeof ERP_PERMISSIONS.ATTENDANCE.EXPORT
  | typeof ERP_PERMISSIONS.ATTENDANCE.REPORTS
  | typeof ERP_PERMISSIONS.ATTENDANCE.DASHBOARD
  | typeof ERP_PERMISSIONS.ATTENDANCE.STUDENTS_MARK
  | typeof ERP_PERMISSIONS.ATTENDANCE.STAFF_MARK
  | typeof ERP_PERMISSIONS.ATTENDANCE.HISTORY_VIEW
  | typeof ERP_PERMISSIONS.ATTENDANCE.REPORTS_VIEW
  | typeof ERP_PERMISSIONS.ATTENDANCE.TEACHER_MARK
  | typeof ERP_PERMISSIONS.ATTENDANCE.TEACHER_HISTORY
  | typeof ERP_PERMISSIONS.ATTENDANCE.PARENT_VIEW
  | typeof ERP_PERMISSIONS.ATTENDANCE.STUDENT_VIEW
  | typeof ERP_PERMISSIONS.STUDENTS.VIEW
  | typeof ERP_PERMISSIONS.STUDENTS.CREATE
  | typeof ERP_PERMISSIONS.STUDENTS.EDIT
  | typeof ERP_PERMISSIONS.STUDENTS.DELETE
  | typeof ERP_PERMISSIONS.STAFF.VIEW
  | typeof ERP_PERMISSIONS.STAFF.CREATE
  | typeof ERP_PERMISSIONS.STAFF.EDIT
  | typeof ERP_PERMISSIONS.STAFF.DELETE
  | typeof ERP_PERMISSIONS.FEES.VIEW
  | typeof ERP_PERMISSIONS.FEES.COLLECT
  | typeof ERP_PERMISSIONS.FEES.REPORTS
  | typeof ERP_PERMISSIONS.SETTINGS.VIEW
  | typeof ERP_PERMISSIONS.SETTINGS.EDIT
  | typeof ERP_PERMISSIONS.NOTIFICATIONS.VIEW
  | typeof ERP_PERMISSIONS.ADMISSIONS.VIEW
  | typeof ERP_PERMISSIONS.ADMISSIONS.CREATE
  | typeof ERP_PERMISSIONS.ADMISSIONS.BULK_IMPORT
  | typeof ERP_PERMISSIONS.ADMISSIONS.PRINT
  | typeof ERP_PERMISSIONS.ACADEMICS.VIEW
  | typeof ERP_PERMISSIONS.ACADEMICS.EDIT;
