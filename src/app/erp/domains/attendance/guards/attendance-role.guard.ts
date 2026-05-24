import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { ErpRole } from '../../../shared/types/erp.types';

/**
 * attendanceRoleGuard
 *
 * Protects attendance routes by allowed roles.
 * Usage: canActivate: [attendanceRoleGuard(['admin', 'teacher'])]
 *
 * Returns a factory function per route, keeping guard logic centralized.
 */
export function attendanceRoleGuard(allowedRoles: ErpRole[]): CanActivateFn {
  return () => {
    const auth   = inject(AuthService);
    const router = inject(Router);

    if (auth.hasRole(allowedRoles)) {
      return true;
    }

    // Redirect unauthorized to the attendance root (which will show their own view)
    router.navigate(['/erp/attendance']);
    return false;
  };
}
