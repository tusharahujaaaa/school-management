import { Routes } from '@angular/router';
import { BusListComponent } from '../pages/bus-list/bus-list.component';
import { permissionGuard } from '../../../core/permissions/guards/permission.guard';
import { ERP_PERMISSIONS } from '../../../core/permissions/constants/permission.constants';

export const transportRoutes: Routes = [
  {
    path: '',
    component: BusListComponent,
    canActivate: [permissionGuard],
    data: { permission: ERP_PERMISSIONS.TRANSPORT.VIEW }
  },
  {
    path: 'buses/:id',
    loadComponent: () => import('../pages/bus-detail/bus-detail.component').then(m => m.BusDetailComponent),
    canActivate: [permissionGuard],
    data: { permission: ERP_PERMISSIONS.TRANSPORT.VIEW }
  }
];
