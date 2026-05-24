import { Routes } from '@angular/router';
import { attendanceRoleGuard } from '../guards/attendance-role.guard';

/**
 * ATTENDANCE ROUTES
 *
 * Structure:
 *  /erp/attendance                        → redirects to role-specific home
 *  /erp/attendance/dashboard              → Admin/Principal/HR overview
 *  /erp/attendance/students               → Admin/Principal/Teacher mark students
 *  /erp/attendance/staff                  → Admin/Principal/HR mark staff
 *  /erp/attendance/history                → Admin/Principal/Teacher history
 *  /erp/attendance/reports                → Admin/Principal/HR/Accountant
 *  /erp/attendance/teacher/mark           → Teacher fast-mark UI
 *  /erp/attendance/parent/my-child        → Parent: child summary
 *  /erp/attendance/student/my-attendance  → Student: self summary
 */
export const attendanceRoutes: Routes = [

  // ── Default redirect ────────────────────────────────────
  // The shell component's canActivate handles role-based redirect
  {
    path: '',
    loadComponent: () =>
      import('../attendance-role-shell.component').then(m => m.AttendanceRoleShellComponent),
    children: [

      // Default — empty path redirects to dashboard (admin default)
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      // ── Admin / Principal / HR ────────────────────────────
      {
        path: 'dashboard',
        canActivate: [attendanceRoleGuard(['admin', 'principal', 'hr', 'staff', 'accountant'])],
        loadComponent: () =>
          import('../pages/attendance-dashboard/attendance-dashboard.component')
            .then(m => m.AttendanceDashboardComponent)
      },
      {
        path: 'students',
        canActivate: [attendanceRoleGuard(['admin', 'principal', 'teacher'])],
        loadComponent: () =>
          import('../pages/student-attendance/student-attendance.component')
            .then(m => m.StudentAttendanceComponent)
      },
      {
        path: 'staff',
        canActivate: [attendanceRoleGuard(['admin', 'principal', 'hr'])],
        loadComponent: () =>
          import('../pages/staff-attendance/staff-attendance.component')
            .then(m => m.StaffAttendanceComponent)
      },
      {
        path: 'history',
        canActivate: [attendanceRoleGuard(['admin', 'principal', 'teacher', 'hr'])],
        loadComponent: () =>
          import('../pages/attendance-history/attendance-history.component')
            .then(m => m.AttendanceHistoryComponent)
      },
      {
        path: 'reports',
        canActivate: [attendanceRoleGuard(['admin', 'principal', 'hr', 'accountant'])],
        loadComponent: () =>
          import('../pages/attendance-reports/attendance-reports.component')
            .then(m => m.AttendanceReportsComponent)
      },

      // ── Teacher Portal ────────────────────────────────────
      {
        path: 'teacher',
        canActivate: [attendanceRoleGuard(['admin', 'principal', 'teacher'])],
        children: [
          {
            path: 'mark',
            loadComponent: () =>
              import('../pages/teacher/teacher-attendance/teacher-attendance.component')
                .then(m => m.TeacherAttendanceComponent)
          },
          { path: '', redirectTo: 'mark', pathMatch: 'full' }
        ]
      },

      // ── Parent Portal ─────────────────────────────────────
      {
        path: 'parent',
        canActivate: [attendanceRoleGuard(['parent', 'admin', 'principal'])],
        children: [
          {
            path: 'my-child',
            loadComponent: () =>
              import('../pages/parent/parent-attendance/parent-attendance.component')
                .then(m => m.ParentAttendanceComponent)
          },
          { path: '', redirectTo: 'my-child', pathMatch: 'full' }
        ]
      },

      // ── Student Portal ────────────────────────────────────
      {
        path: 'student',
        canActivate: [attendanceRoleGuard(['student', 'admin', 'principal'])],
        children: [
          {
            path: 'my-attendance',
            loadComponent: () =>
              import('../pages/student/student-attendance-view/student-attendance-view.component')
                .then(m => m.StudentAttendanceViewComponent)
          },
          { path: '', redirectTo: 'my-attendance', pathMatch: 'full' }
        ]
      }

    ]
  }
];
