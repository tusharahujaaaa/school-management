import { Routes } from '@angular/router';
import { AuthLayoutComponent } from '../layout/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from '../layout/dashboard-layout/dashboard-layout.component';
import { authGuard } from '../domains/auth/guards/auth.guard';
import { noAuthGuard } from '../domains/auth/guards/no-auth.guard';
import { permissionGuard } from '../core/permissions/guards/permission.guard';
import { ERP_PERMISSIONS } from '../core/permissions/constants/permission.constants';

export const erpRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [noAuthGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('../domains/auth/login/login.component').then(m => m.LoginComponent)
      }
    ]
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('../domains/dashboard/home/home.component').then(m => m.HomeComponent),
        canActivate: [permissionGuard],
        data: { permission: ERP_PERMISSIONS.DASHBOARD.VIEW }
      },
      {
        path: 'notifications',
        loadComponent: () => import('../pages/notifications/notifications.component').then(m => m.NotificationsComponent),
        canActivate: [permissionGuard],
        data: { permission: ERP_PERMISSIONS.NOTIFICATIONS.VIEW }
      },
      {
        path: 'attendance',
        loadChildren: () => import('../domains/attendance/routes/attendance.routes').then(m => m.attendanceRoutes),
        canActivate: [permissionGuard],
        data: { permission: ERP_PERMISSIONS.ATTENDANCE.VIEW }
      },
      {
        path: 'students',
        loadChildren: () => import('../domains/students/routes/student.routes').then(m => m.studentRoutes),
        canActivate: [permissionGuard],
        data: { permission: ERP_PERMISSIONS.STUDENTS.VIEW }
      },
      {
        path: 'unauthorized',
        loadComponent: () => import('../pages/unauthorized/unauthorized-page.component').then(m => m.UnauthorizedPageComponent)
      }
    ]
  }
];
