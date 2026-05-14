import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { PermissionService } from '../services/permission.service';

/**
 * Route Guard for permission-based access control
 * Usage in routes:
 * { 
 *   path: 'edit', 
 *   component: EditComponent, 
 *   canActivate: [permissionGuard],
 *   data: { permission: 'attendance.edit' } 
 * }
 */
export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  const requiredPermission = route.data['permission'] as string;
  const requiredPermissions = route.data['permissions'] as string[];

  if (!requiredPermission && !requiredPermissions) {
    return true;
  }

  const hasAccess = requiredPermission 
    ? permissionService.hasPermission(requiredPermission)
    : permissionService.hasAnyPermission(requiredPermissions);

  if (hasAccess) {
    return true;
  }

  // Redirect to unauthorized page
  return router.parseUrl('/erp/unauthorized');
};
