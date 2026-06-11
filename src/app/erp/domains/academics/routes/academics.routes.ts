import { Routes } from '@angular/router';
import { ClassListComponent } from '../pages/class-list/class-list.component';
import { permissionGuard } from '../../../core/permissions/guards/permission.guard';
import { ERP_PERMISSIONS } from '../../../core/permissions/constants/permission.constants';

export const academicsRoutes: Routes = [
  {
    path: '',
    component: ClassListComponent,
    canActivate: [permissionGuard],
    data: { permission: ERP_PERMISSIONS.ACADEMICS.VIEW }
  }
];
