import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';
import { AttendanceService } from '../../services/attendance.service';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { StatCardComponent } from '../../../../shared/ui/stats/stat-card.component';
import { ErpTableComponent } from '../../../../shared/ui/tables/erp-table.component';
import { HasPermissionDirective } from '../../../../core/permissions/directives/has-permission.directive';
import { ERP_PERMISSIONS } from '../../../../core/permissions/constants/permission.constants';
import { AttendanceAlertCardComponent } from '../../components/attendance-alert-card/attendance-alert-card.component';

@Component({
  selector: 'app-attendance-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ProgressBarModule,
    PageHeaderComponent, StatCardComponent, ErpTableComponent, HasPermissionDirective, AttendanceAlertCardComponent
  ],
  templateUrl: './attendance-dashboard.component.html',
  styleUrls: ['./attendance-dashboard.component.scss']
})
export class AttendanceDashboardComponent implements OnInit {
  private svc = inject(AttendanceService);
  readonly PERMS = ERP_PERMISSIONS;

  stats = this.svc.dashboardStats;
  classSummaries = this.svc.classSummaries;
  alerts = this.svc.lowAttendanceAlerts;
  tableCols = [
    { field: 'class', header: 'Class', sortable: true },
    { field: 'section', header: 'Section', sortable: true },
    { field: 'totalStudents', header: 'Total', sortable: true },
    { field: 'present', header: 'Present', sortable: true },
    { field: 'absent', header: 'Absent', sortable: true },
    { field: 'late', header: 'Late', sortable: true },
    { field: 'percentage', header: 'Attendance %', sortable: true }
  ];

  today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  ngOnInit() {
    this.svc.loadDashboardStats();
  }
}
