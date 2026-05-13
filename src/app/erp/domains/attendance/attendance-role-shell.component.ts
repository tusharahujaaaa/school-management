import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { ErpRole } from '../../shared/types/erp.types';

/**
 * AttendanceRoleShellComponent
 *
 * Acts as a role-aware dispatch layer for the attendance feature.
 * This component is the entry point for /erp/attendance — it reads the
 * current user role and redirects to the appropriate role-scoped view.
 *
 * Architecture benefit:
 *  - No role-check duplication across pages
 *  - Single place to extend when new roles are added
 *  - Compatible with future guards and RBAC middleware
 *
 * Role → Route mapping:
 *  admin / principal / hr → /erp/attendance/dashboard (full admin view)
 *  teacher               → /erp/attendance/teacher/mark (fast marking UI)
 *  parent                → /erp/attendance/parent/my-child (child summary)
 *  student               → /erp/attendance/student/my-attendance (self view)
 */
@Component({
  selector: 'app-attendance-role-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <router-outlet></router-outlet>
  `
})
export class AttendanceRoleShellComponent {
  private auth = inject(AuthService);

  readonly currentRole = this.auth.currentRole;

  readonly isAdmin     = this.auth.isAdmin;
  readonly isPrincipal = this.auth.isPrincipal;
  readonly isTeacher   = this.auth.isTeacher;
  readonly isParent    = this.auth.isParent;
  readonly isStudent   = this.auth.isStudent;
  readonly isHR        = this.auth.isHR;
}
