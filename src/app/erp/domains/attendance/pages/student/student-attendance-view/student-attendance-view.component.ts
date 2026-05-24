import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendancePercentageWidgetComponent } from '../../../components/shared/attendance-percentage-widget/attendance-percentage-widget.component';
import { AttendanceStatusBadgeComponent } from '../../../components/attendance-status-badge/attendance-status-badge.component';

// Mock own-student data — replace with session user from AuthService
const MOCK_SELF = {
  id: 's1', name: 'Aarav Sharma', rollNumber: '01',
  class: 'Class 10', section: 'A',
  presentDays: 57, totalDays: 60,
  attendancePercentage: 95.0
};

// Monthly breakdown mock — replace with API data
const MONTHLY_BREAKDOWN = [
  { month: 'January', present: 22, absent: 0, total: 22, pct: 100 },
  { month: 'February', present: 18, absent: 2, total: 20, pct: 90 },
  { month: 'March',   present: 17, absent: 3, total: 20, pct: 85 },
];

/**
 * Student Portal — Attendance View
 * Shows the logged-in student's own attendance summary, monthly breakdown,
 * and status for recent days.
 * Read-only.
 */
@Component({
  selector: 'app-student-attendance-view',
  standalone: true,
  imports: [CommonModule, AttendancePercentageWidgetComponent],
  templateUrl: './student-attendance-view.component.html',
  styleUrls: ['./student-attendance-view.component.scss']
})
export class StudentAttendanceViewComponent {
  student = signal(MOCK_SELF);
  monthlyBreakdown = signal(MONTHLY_BREAKDOWN);

  getPctClass(pct: number): string {
    if (pct >= 90) return 'text-green-500';
    if (pct >= 75) return 'text-orange-500';
    return 'text-red-500';
  }
}
