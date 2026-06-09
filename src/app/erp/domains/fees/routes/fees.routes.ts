import { Routes } from '@angular/router';
import { permissionGuard } from '../../../core/permissions/guards/permission.guard';
import { ERP_PERMISSIONS } from '../../../core/permissions/constants/permission.constants';

export const feesRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('../pages/fee-dashboard/fee-dashboard.component').then(m => m.FeeDashboardComponent),
    canActivate: [permissionGuard],
    data: { permission: ERP_PERMISSIONS.FEES.VIEW }
  },
  {
    path: 'structures',
    loadComponent: () => import('../pages/fee-structures/fee-structures.component').then(m => m.FeeStructuresComponent),
    canActivate: [permissionGuard],
    data: { permission: ERP_PERMISSIONS.FEES.VIEW }
  },
  {
    path: 'records',
    loadComponent: () => import('../pages/fee-records/fee-records.component').then(m => m.FeeRecordsComponent),
    canActivate: [permissionGuard],
    data: { permission: ERP_PERMISSIONS.FEES.VIEW }
  }
];
