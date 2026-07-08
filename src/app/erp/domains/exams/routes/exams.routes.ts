import { Routes } from '@angular/router';
import { ExamsDashboardComponent } from '../pages/exams-dashboard/exams-dashboard.component';
import { MarksEntryComponent } from '../pages/marks-entry/marks-entry.component';
import { ReportCardComponent } from '../pages/report-card/report-card.component';
import { permissionGuard } from '../../../core/permissions/guards/permission.guard';
import { ERP_PERMISSIONS } from '../../../core/permissions/constants/permission.constants';

export const examsRoutes: Routes = [
  {
    path: '',
    component: ExamsDashboardComponent,
    canActivate: [permissionGuard],
    data: { permission: ERP_PERMISSIONS.EXAMS.VIEW }
  },
  {
    path: 'subjects/:id/marks',
    component: MarksEntryComponent,
    canActivate: [permissionGuard],
    data: { permission: ERP_PERMISSIONS.EXAMS.ENTER_MARKS }
  },
  {
    path: 'students/:studentId/exams/:examId/report',
    component: ReportCardComponent,
    canActivate: [permissionGuard],
    data: { permission: ERP_PERMISSIONS.EXAMS.VIEW }
  }
];
