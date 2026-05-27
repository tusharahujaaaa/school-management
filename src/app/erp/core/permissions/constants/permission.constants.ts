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
  | typeof ERP_PERMISSIONS.NOTIFICATIONS.VIEW;
