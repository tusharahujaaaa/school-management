import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AttendanceService } from '../../services/attendance.service';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { ErpTableComponent } from '../../../../shared/ui/tables/erp-table.component';
import { StatusBadgeComponent, BadgeSeverity } from '../../../../shared/ui/badges/status-badge.component';
import { AttendanceStatus } from '../../models/attendance.model';

@Component({
  selector: 'app-student-attendance',
  standalone: true,
  imports: [
    CommonModule, FormsModule, SelectModule, InputTextModule, ButtonModule, ToastModule,
    PageHeaderComponent, StatusBadgeComponent, ErpTableComponent
  ],
  providers: [MessageService],
  templateUrl: './student-attendance.component.html',
  styleUrls: ['./student-attendance.component.scss']
})
export class StudentAttendanceComponent {
  svc = inject(AttendanceService);
  private messageService = inject(MessageService);

  classOptions = this.svc.classes().map(c => ({ label: c, value: c }));
  sectionOptions = this.svc.sections().map(s => ({ label: `Section ${s}`, value: s }));

  selectedDate = signal(this.svc.selectedDate());
  selectedClass = signal(this.svc.selectedClass());
  selectedSection = signal(this.svc.selectedSection());
  searchQuery = signal('');
  isSubmitting = signal(false);

  students = this.svc.filteredStudents;
  records = this.svc.studentRecords;
  summary = this.svc.attendanceSummary;

  readonly statusOptions: { label: string; value: AttendanceStatus }[] = [
    { label: 'Present', value: 'present' },
    { label: 'Absent', value: 'absent' },
    { label: 'Late', value: 'late' },
    { label: 'Leave', value: 'leave' }
  ];

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

  onSearch(val: string) {
    this.searchQuery.set(val);
    this.svc.studentSearchQuery.set(val);
  }

  markStatus(studentId: string, status: AttendanceStatus) {
    this.svc.markStudentAttendance(studentId, status);
  }

  markAllPresent() { this.svc.markAllStudents('present'); }
  markAllAbsent() { this.svc.markAllStudents('absent'); }
  reset() { this.svc.resetStudentAttendance(); }

  getStatus(studentId: string): AttendanceStatus | null {
    return this.svc.getStudentStatus(studentId);
  }

  submit() {
    this.isSubmitting.set(true);
    this.svc.submitAttendance().subscribe(() => {
      this.isSubmitting.set(false);
      this.messageService.add({ severity: 'success', summary: 'Submitted', detail: 'Attendance saved successfully!' });
    });
  }
}
