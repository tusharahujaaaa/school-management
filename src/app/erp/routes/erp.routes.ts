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
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('../domains/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
        path: 'reset-password',
        loadComponent: () => import('../domains/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
      }
    ]
  },
  {
    path: 'admission-inquiry/:domain',
    loadComponent: () => import('../domains/admissions/pages/admission-inquiry/admission-inquiry.component').then(m => m.AdmissionInquiryComponent)
  },
  {
    path: 'admission-inquiry',
    loadComponent: () => import('../domains/admissions/pages/admission-inquiry/admission-inquiry.component').then(m => m.AdmissionInquiryComponent)
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
        path: 'fees',
        loadChildren: () => import('../domains/fees/routes/fees.routes').then(m => m.feesRoutes),
        canActivate: [permissionGuard],
        data: { permission: ERP_PERMISSIONS.FEES.VIEW }
      },
      {
        path: 'admissions',
        loadChildren: () => import('../domains/admissions/routes/admissions.routes').then(m => m.admissionsRoutes),
        canActivate: [permissionGuard],
        data: { permission: ERP_PERMISSIONS.ADMISSIONS.VIEW }
      },
      {
        path: 'teachers',
        loadChildren: () => import('../domains/teachers/routes/teachers.routes').then(m => m.teachersRoutes),
        canActivate: [permissionGuard],
        data: { permission: ERP_PERMISSIONS.STAFF.VIEW }
      },
      {
        path: 'academics',
        loadChildren: () => import('../domains/academics/routes/academics.routes').then(m => m.academicsRoutes),
        canActivate: [permissionGuard],
        data: { permission: ERP_PERMISSIONS.ACADEMICS.VIEW }
      },
      {
        path: 'exams',
        loadChildren: () => import('../domains/exams/routes/exams.routes').then(m => m.examsRoutes),
        canActivate: [permissionGuard],
        data: { permission: ERP_PERMISSIONS.EXAMS.VIEW }
      },
      {
        path: 'settings',
        loadChildren: () => import('../domains/settings/routes/settings.routes').then(m => m.settingsRoutes),
        canActivate: [permissionGuard],
        data: { permission: ERP_PERMISSIONS.SETTINGS.VIEW }
      },
      {
        path: 'transport',
        loadChildren: () => import('../domains/transport/routes/transport.routes').then(m => m.transportRoutes),
        canActivate: [permissionGuard],
        data: { permission: ERP_PERMISSIONS.TRANSPORT.VIEW }
      },
      {
        path: 'unauthorized',
        loadComponent: () => import('../pages/unauthorized/unauthorized-page.component').then(m => m.UnauthorizedPageComponent)
      }
    ]
  }
];
