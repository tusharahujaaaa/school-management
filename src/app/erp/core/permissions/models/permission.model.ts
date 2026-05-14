import { ErpPermission, ERP_PERMISSIONS } from '../constants/permission.constants';

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT' | 'ACCOUNTANT';

export interface RolePermissionMapping {
  role: UserRole;
  permissions: ErpPermission[];
}

/**
 * Static Role-Permission Mapping
 * In a real app, this might be fetched from the backend on login.
 */
export const ROLE_PERMISSIONS: Record<UserRole, ErpPermission[]> = {
  ADMIN: [
    ERP_PERMISSIONS.DASHBOARD.VIEW,
    ...Object.values(ERP_PERMISSIONS.ATTENDANCE),
    ...Object.values(ERP_PERMISSIONS.STUDENTS),
    ...Object.values(ERP_PERMISSIONS.STAFF),
    ...Object.values(ERP_PERMISSIONS.FEES),
    ...Object.values(ERP_PERMISSIONS.SETTINGS),
  ] as ErpPermission[],

  TEACHER: [
    ERP_PERMISSIONS.DASHBOARD.VIEW,
    ERP_PERMISSIONS.ATTENDANCE.VIEW,
    ERP_PERMISSIONS.ATTENDANCE.CREATE,
    ERP_PERMISSIONS.ATTENDANCE.EDIT,
    ERP_PERMISSIONS.STUDENTS.VIEW,
  ],

  STUDENT: [
    ERP_PERMISSIONS.DASHBOARD.VIEW,
    ERP_PERMISSIONS.ATTENDANCE.VIEW,
  ],

  PARENT: [
    ERP_PERMISSIONS.DASHBOARD.VIEW,
    ERP_PERMISSIONS.ATTENDANCE.VIEW,
    ERP_PERMISSIONS.FEES.VIEW,
  ],

  ACCOUNTANT: [
    ERP_PERMISSIONS.DASHBOARD.VIEW,
    ERP_PERMISSIONS.FEES.VIEW,
    ERP_PERMISSIONS.FEES.COLLECT,
    ERP_PERMISSIONS.FEES.REPORTS,
  ]
};
