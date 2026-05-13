import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AttendanceService } from '../../services/attendance.service';
import { AttendanceAlertCardComponent } from '../../components/attendance-alert-card/attendance-alert-card.component';

@Component({
  selector: 'app-attendance-reports',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './attendance-reports.component.html',
  styleUrls: ['./attendance-reports.component.scss']
})
export class AttendanceReportsComponent {
  private svc = inject(AttendanceService);
  reports = this.svc.reports;
  alerts = this.svc.lowAttendanceAlerts;
  stats = this.svc.dashboardStats;
}
