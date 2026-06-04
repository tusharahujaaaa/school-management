import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AttendanceService } from '../../../services/attendance.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { PageHeaderComponent } from '../../../../../shared/ui/page-header/page-header.component';
import { ErpTableComponent } from '../../../../../shared/ui/tables/erp-table.component';
import { StatusBadgeComponent, BadgeSeverity } from '../../../../../shared/ui/badges/status-badge.component';
import { HasPermissionDirective } from '../../../../../core/permissions/directives/has-permission.directive';
import { ERP_PERMISSIONS } from '../../../../../core/permissions/constants/permission.constants';
import { AttendanceStatus } from '../../../models/attendance.model';

/**
 * Teacher Attendance View
 * - Fast single-page marking UI for the teacher's assigned class
 * - Optimised for speed: one-click status buttons, bulk mark, submit, save draft
 */
@Component({
  selector: 'app-teacher-attendance',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ProgressBarModule, ConfirmDialogModule, ButtonModule, ToastModule, 
    PageHeaderComponent, ErpTableComponent, StatusBadgeComponent, HasPermissionDirective
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './teacher-attendance.component.html',
  styleUrls: ['./teacher-attendance.component.scss']
})
export class TeacherAttendanceComponent {
  svc = inject(AttendanceService);
  private msg = inject(MessageService);
  private confirmSvc = inject(ConfirmationService);
  auth = inject(AuthService);
  readonly PERMS = ERP_PERMISSIONS;

  students = this.svc.filteredStudents;
  records  = this.svc.studentRecords;
  summary  = this.svc.attendanceSummary;
  sheetStatus = this.svc.currentSheetStatus;

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
  isSubmitting = signal(false);
  isSavingDraft = signal(false);

  sheetStatusLabel = computed(() => {
    const status = this.sheetStatus();
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  });

  sheetStatusSeverity = computed(() => {
    const mapping: Record<string, BadgeSeverity> = {
      'DRAFT': 'warning',
      'SUBMITTED': 'success',
      'LOCKED': 'neutral',
      'EDITED': 'info'
    };
    return mapping[this.sheetStatus()] || 'neutral';
  });

  isFutureDate = computed(() => {
    return this.svc.isFutureDate(this.svc.selectedDate());
  });

  markingProgress = computed(() => {
    const total = this.students().length;
    if (total === 0) return 0;
    const marked = total - this.summary().unmarked;
    return Math.round((marked / total) * 100);
  });

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
    try {
      this.svc.markStudentAttendance(studentId, status);
    } catch (e: any) {
      this.msg.add({ severity: 'error', summary: 'Error', detail: e.message });
    }
  }

  getStatus(id: string): AttendanceStatus | null {
    return this.svc.getStudentStatus(id);
  }

  markAllPresent() {
    try {
      this.svc.markAllStudents('present');
      this.msg.add({ severity: 'success', summary: 'Marked All Present', detail: 'All class records set to Present.' });
    } catch (e: any) {
      this.msg.add({ severity: 'error', summary: 'Error', detail: e.message });
    }
  }

  reset() {
    try {
      this.svc.resetStudentAttendance();
      this.msg.add({ severity: 'info', summary: 'Reset Done', detail: 'Attendance selection cleared.' });
    } catch (e: any) {
      this.msg.add({ severity: 'error', summary: 'Error', detail: e.message });
    }
  }

  saveAsDraft() {
    try {
      this.isSavingDraft.set(true);
      this.svc.saveDraft().subscribe({
        next: () => {
          this.isSavingDraft.set(false);
          this.msg.add({ severity: 'success', summary: 'Draft Saved', detail: 'Attendance draft updated successfully.' });
        },
        error: (err) => {
          this.isSavingDraft.set(false);
          this.msg.add({ severity: 'error', summary: 'Error', detail: err.message });
        }
      });
    } catch (e: any) {
      this.isSavingDraft.set(false);
      this.msg.add({ severity: 'error', summary: 'Error', detail: e.message });
    }
  }

  submit() {
    const unmarked = this.summary().unmarked;
    if (unmarked > 0) {
      this.confirmSvc.confirm({
        message: `There are ${unmarked} students not marked. Are you sure you want to finalize and submit this daily record?`,
        header: 'Incomplete Marking Check',
        icon: 'pi pi-exclamation-triangle',
        acceptButtonProps: { label: 'Yes, Submit', class: 'p-button-warning' },
        rejectButtonProps: { label: 'Cancel', class: 'p-button-outlined p-button-secondary' },
        accept: () => {
          this.executeSubmit();
        }
      });
    } else {
      this.executeSubmit();
    }
  }

  private executeSubmit() {
    try {
      this.isSubmitting.set(true);
      this.svc.submitAttendance().subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.msg.add({ severity: 'success', summary: 'Submitted', detail: 'Daily attendance committed successfully!' });
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.msg.add({ severity: 'error', summary: 'Error', detail: err.message || 'Submission failed' });
        }
      });
    } catch (e: any) {
      this.isSubmitting.set(false);
      this.msg.add({ severity: 'error', summary: 'Error', detail: e.message });
    }
  }
}
