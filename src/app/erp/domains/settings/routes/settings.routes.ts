import { Routes } from '@angular/router';
import { SettingsDashboardComponent } from '../pages/settings-dashboard/settings-dashboard.component';
import { permissionGuard } from '../../../core/permissions/guards/permission.guard';
import { ERP_PERMISSIONS } from '../../../core/permissions/constants/permission.constants';

export const settingsRoutes: Routes = [
  {
    path: '',
    component: SettingsDashboardComponent,
    canActivate: [permissionGuard],
    data: { permission: ERP_PERMISSIONS.SETTINGS.VIEW }
  }
];
