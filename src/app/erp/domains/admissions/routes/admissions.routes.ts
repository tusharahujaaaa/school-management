import { Routes } from '@angular/router';
import { permissionGuard } from '../../../core/permissions/guards/permission.guard';
import { ERP_PERMISSIONS } from '../../../core/permissions/constants/permission.constants';

export const admissionsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'admit',
    pathMatch: 'full'
  },
  {
    path: 'admit',
    loadComponent: () =>
      import('../pages/admit-student/admit-student.component').then(m => m.AdmitStudentComponent),
    canActivate: [permissionGuard],
    data: { permission: ERP_PERMISSIONS.ADMISSIONS.CREATE }
  },
  {
    path: 'bulk',
    loadComponent: () =>
      import('../pages/admit-bulk/admit-bulk.component').then(m => m.AdmitBulkComponent),
    canActivate: [permissionGuard],
    data: { permission: ERP_PERMISSIONS.ADMISSIONS.BULK_IMPORT }
  },
  {
    path: 'requests',
    loadComponent: () =>
      import('../pages/admission-requests/admission-requests.component').then(m => m.AdmissionRequestsComponent),
    canActivate: [permissionGuard],
    data: { permission: ERP_PERMISSIONS.ADMISSIONS.VIEW }
  },
  {
    path: 'inquiry',
    loadComponent: () =>
      import('../pages/admission-inquiry/admission-inquiry.component').then(m => m.AdmissionInquiryComponent),
    canActivate: [permissionGuard],
    data: { permission: ERP_PERMISSIONS.ADMISSIONS.VIEW }
  },
  {
    path: 'print',
    loadComponent: () =>
      import('../pages/print-admission-form/print-admission-form.component').then(m => m.PrintAdmissionFormComponent),
    canActivate: [permissionGuard],
    data: { permission: ERP_PERMISSIONS.ADMISSIONS.PRINT }
  }
];
