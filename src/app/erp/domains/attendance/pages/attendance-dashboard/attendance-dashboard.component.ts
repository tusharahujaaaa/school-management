import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';
import { AttendanceService } from '../../services/attendance.service';
import { AttendanceStatCardComponent } from '../../components/attendance-stat-card/attendance-stat-card.component';
import { AttendanceAlertCardComponent } from '../../components/attendance-alert-card/attendance-alert-card.component';
import { AttendanceStatusBadgeComponent } from '../../components/attendance-status-badge/attendance-status-badge.component';

@Component({
  selector: 'app-attendance-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ProgressBarModule,
    AttendanceStatCardComponent, AttendanceAlertCardComponent
  ],
  templateUrl: './attendance-dashboard.component.html',
  styleUrls: ['./attendance-dashboard.component.scss']
})
export class AttendanceDashboardComponent {
  private svc = inject(AttendanceService);

  stats = this.svc.dashboardStats;
  classSummaries = this.svc.classSummaries;
  alerts = this.svc.lowAttendanceAlerts;
  today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
