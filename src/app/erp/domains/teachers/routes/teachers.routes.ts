import { Routes } from '@angular/router';
import { TeacherListComponent } from '../pages/teacher-list/teacher-list.component';
import { permissionGuard } from '../../../core/permissions/guards/permission.guard';
import { ERP_PERMISSIONS } from '../../../core/permissions/constants/permission.constants';

export const teachersRoutes: Routes = [
  {
    path: '',
    component: TeacherListComponent,
    canActivate: [permissionGuard],
    data: { permission: ERP_PERMISSIONS.STAFF.VIEW }
  }
];
