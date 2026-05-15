import { Injectable, inject, signal, computed } from '@angular/core';
import { AuthService } from '../../../domains/auth/services/auth.service';
import { ErpPermission } from '../constants/permission.constants';
import { ROLE_PERMISSIONS, UserRole } from '../models/permission.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private authService = inject(AuthService);

  /**
   * Permissions for the current user's role
   */
  readonly userPermissions = computed(() => {
    const role = (this.authService.currentUser()?.role.toUpperCase() as UserRole);
    if (!role) return [];

    const formattedRole = role.toUpperCase() as UserRole

    return ROLE_PERMISSIONS[role] || [];
  });

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: ErpPermission | string): boolean {
    // If we're using string, we assume it's a valid ErpPermission
    return this.userPermissions().includes(permission as ErpPermission);
  }

  /**
   * Check if user has any of the given permissions
   */
  hasAnyPermission(permissions: (ErpPermission | string)[]): boolean {
    return permissions.some(p => this.hasPermission(p));
  }

  /**
   * Check if user has all of the given permissions
   */
  hasAllPermissions(permissions: (ErpPermission | string)[]): boolean {
    return permissions.every(p => this.hasPermission(p));
  }

  /**
   * Check if user can access a module (prefix based check)
   */
  canAccessModule(moduleName: string): boolean {
    return this.userPermissions().some(p => p.startsWith(`${moduleName}.`));
  }
}
