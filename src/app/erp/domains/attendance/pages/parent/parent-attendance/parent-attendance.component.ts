import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../../services/attendance.service';
import { AttendancePercentageWidgetComponent } from '../../../components/shared/attendance-percentage-widget/attendance-percentage-widget.component';
import { AttendanceHistoryCardComponent } from '../../../components/shared/attendance-history-card/attendance-history-card.component';
import { LowAttendanceAlert } from '../../../models/attendance.model';

// Mock child data — replace with real parent→child link from API
const MOCK_CHILD = {
  id: 's3', name: 'Rahul Verma', rollNumber: '03',
  class: 'Class 10', section: 'A',
  presentDays: 54, totalDays: 60,
  attendancePercentage: 90.0
};

/**
 * Parent Portal — Attendance View
 * Shows a child's attendance summary, percentage widget, and recent history.
 * Read-only: no editing controls.
 */
@Component({
  selector: 'app-parent-attendance',
  standalone: true,
  imports: [CommonModule, AttendancePercentageWidgetComponent, AttendanceHistoryCardComponent],
  templateUrl: './parent-attendance.component.html',
  styleUrls: ['./parent-attendance.component.scss']
})
export class ParentAttendanceComponent {
  private svc = inject(AttendanceService);

  child = signal(MOCK_CHILD);

  // Recent class history filtered to the child's class
  recentHistory = computed(() =>
    this.svc.history()
      .filter(h => h.class === this.child().class && h.section === this.child().section)
      .slice(0, 6)
  );

  // Low attendance alert for this child (if any)
  alert = computed(() =>
    this.svc.lowAttendanceAlerts()
      .find(a => a.studentId === this.child().id) ?? null
  );
}
