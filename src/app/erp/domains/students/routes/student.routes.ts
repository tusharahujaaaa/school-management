import { Routes } from '@angular/router';
import { StudentListComponent } from '../pages/student-list/student-list.component';
import { StudentProfileComponent } from '../pages/student-profile/student-profile.component';
import { permissionGuard } from '../../../core/permissions/guards/permission.guard';
import { ERP_PERMISSIONS } from '../../../core/permissions/constants/permission.constants';

export const studentRoutes: Routes = [
  {
    path: '',
    component: StudentListComponent,
    canActivate: [permissionGuard],
    data: { permission: ERP_PERMISSIONS.STUDENTS.VIEW }
  },
  {
    path: ':id',
    component: StudentProfileComponent,
    canActivate: [permissionGuard],
    data: { permission: ERP_PERMISSIONS.STUDENTS.VIEW }
  }
];
