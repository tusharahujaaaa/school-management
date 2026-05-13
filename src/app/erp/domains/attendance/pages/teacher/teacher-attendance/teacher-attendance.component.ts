import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AttendanceService } from '../../../services/attendance.service';
import { AttendanceStatusBadgeComponent } from '../../../components/attendance-status-badge/attendance-status-badge.component';
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
  imports: [CommonModule, RouterModule, ButtonModule, ToastModule, AttendanceStatusBadgeComponent],
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

  today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  isSubmitting = false;

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
