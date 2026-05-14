import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AttendanceService } from '../../../services/attendance.service';
import { PageHeaderComponent } from '../../../../../shared/ui/page-header/page-header.component';
import { ErpTableComponent } from '../../../../../shared/ui/tables/erp-table.component';
import { StatusBadgeComponent, BadgeSeverity } from '../../../../../shared/ui/badges/status-badge.component';
import { AttendanceStatus } from '../../../models/attendance.model';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

/**
 * Teacher Attendance View
 * - Fast single-page marking UI for the teacher's assigned class
 * - Optimised for speed: one-click status buttons, bulk mark, submit
 */
@Component({
  selector: 'app-teacher-attendance',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, ToastModule, PageHeaderComponent, ErpTableComponent, StatusBadgeComponent],
  providers: [MessageService],
  templateUrl: './teacher-attendance.component.html',
  styleUrls: ['./teacher-attendance.component.scss']
})
export class TeacherAttendanceComponent {
  private svc = inject(AttendanceService);
  private msg = inject(MessageService);

  students = this.svc.filteredStudents;
  records  = this.svc.studentRecords;
  summary  = this.svc.attendanceSummary;

  readonly statusOptions: { label: string; value: AttendanceStatus; color: string }[] = [
    { label: 'P', value: 'present', color: 'success' },
    { label: 'A', value: 'absent',  color: 'danger'  },
    { label: 'L', value: 'late',    color: 'warning' },
    { label: 'Leave', value: 'leave', color: 'info'  }
  ];

  tableCols = [
    { field: 'rollNumber', header: 'Roll' },
    { field: 'name', header: 'Student' },
    { field: 'status', header: 'Status' }
  ];

  today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  isSubmitting = false;

  getStatusSeverity(status: AttendanceStatus | null): BadgeSeverity {
    if (!status) return 'neutral';
    const mapping: Record<AttendanceStatus, BadgeSeverity> = {
      present: 'success',
      absent: 'danger',
      late: 'warning',
      leave: 'info'
    };
    return mapping[status] || 'neutral';
  }

  getStatusLabel(status: AttendanceStatus | null): string {
    if (!status) return 'Unmarked';
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  mark(studentId: string, status: AttendanceStatus) {
    this.svc.markStudentAttendance(studentId, status);
  }

  getStatus(id: string): AttendanceStatus | null {
    return this.svc.getStudentStatus(id);
  }

  markAllPresent() { this.svc.markAllStudents('present'); }
  reset()         { this.svc.resetStudentAttendance(); }

  submit() {
    this.isSubmitting = true;
    this.svc.submitAttendance().subscribe(() => {
      this.isSubmitting = false;
      this.msg.add({ severity: 'success', summary: 'Saved', detail: 'Attendance submitted successfully' });
    });
  }
}
