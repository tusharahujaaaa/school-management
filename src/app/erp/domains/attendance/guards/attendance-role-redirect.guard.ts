import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { ErpRole } from '../../../shared/types/erp.types';

/**
 * attendanceRoleRedirect
 *
 * A route resolver that reads the current user's role and returns the
 * correct child route path for /erp/attendance redirect.
 *
 * Used as a redirect-on-load strategy at the parent attendance route.
 */
export const attendanceRoleRedirectGuard = (): string => {
  const auth = inject(AuthService);
  const role = auth.currentRole();

  const roleRouteMap: Partial<Record<ErpRole, string>> = {
    admin:      '/erp/attendance/dashboard',
    principal:  '/erp/attendance/dashboard',
    hr:         '/erp/attendance/dashboard',
    accountant: '/erp/attendance/reports',
    teacher:    '/erp/attendance/teacher/mark',
    parent:     '/erp/attendance/parent/my-child',
    student:    '/erp/attendance/student/my-attendance',
    staff:      '/erp/attendance/dashboard',
  };

  return roleRouteMap[role] ?? '/erp/attendance/dashboard';
};
