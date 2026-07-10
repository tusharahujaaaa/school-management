import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AttendanceService } from '../../services/attendance.service';
import { AuthService } from '../../../auth/services/auth.service';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { ErpTableComponent } from '../../../../shared/ui/tables/erp-table.component';
import { StatusBadgeComponent, BadgeSeverity } from '../../../../shared/ui/badges/status-badge.component';
import { HasPermissionDirective } from '../../../../core/permissions/directives/has-permission.directive';
import { ERP_PERMISSIONS } from '../../../../core/permissions/constants/permission.constants';
import { AttendanceStatus } from '../../models/attendance.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-student-attendance',
  standalone: true,
  imports: [
        CommonModule, FormsModule, RouterModule, SelectModule, InputTextModule, ButtonModule, ToastModule, ProgressBarModule, ConfirmDialogModule, PageHeaderComponent, StatusBadgeComponent, ErpTableComponent, HasPermissionDirective, TranslatePipe
    ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './student-attendance.component.html',
  styleUrls: ['./student-attendance.component.scss']
})
export class StudentAttendanceComponent {
  svc = inject(AttendanceService);
  auth = inject(AuthService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  readonly PERMS = ERP_PERMISSIONS;

  get classOptions() {
    return this.svc.classes().map(c => ({ label: c, value: c }));
  }

  get sectionOptions() {
    return this.svc.sections().map(s => ({ label: `Section ${s}`, value: s }));
  }

  selectedDate = this.svc.selectedDate;
  selectedClass = this.svc.selectedClass;
  selectedSection = this.svc.selectedSection;
  searchQuery = signal('');
  isSubmitting = signal(false);
  isSavingDraft = signal(false);

  students = this.svc.filteredStudents;
  records = this.svc.studentRecords;
  summary = this.svc.attendanceSummary;
  sheetStatus = this.svc.currentSheetStatus;

  readonly statusOptions: { label: string; value: AttendanceStatus }[] = [
    { label: 'Present', value: 'present' },
    { label: 'Absent', value: 'absent' },
    { label: 'Late', value: 'late' },
    { label: 'Leave', value: 'leave' }
  ];

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
    return this.svc.isFutureDate(this.selectedDate());
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

  onSearch(val: string) {
    this.searchQuery.set(val);
    this.svc.studentSearchQuery.set(val);
  }

  markStatus(studentId: string, status: AttendanceStatus) {
    try {
      this.svc.markStudentAttendance(studentId, status);
    } catch (e: any) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: e.message });
    }
  }

  markAllPresent() {
    try {
      this.svc.markAllStudents('present');
      this.messageService.add({ severity: 'success', summary: 'Marked All Present', detail: 'All students set to Present' });
    } catch (e: any) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: e.message });
    }
  }

  markAllAbsent() {
    try {
      this.svc.markAllStudents('absent');
      this.messageService.add({ severity: 'success', summary: 'Marked All Absent', detail: 'All students set to Absent' });
    } catch (e: any) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: e.message });
    }
  }

  reset() {
    try {
      this.svc.resetStudentAttendance();
      this.messageService.add({ severity: 'info', summary: 'Reset Done', detail: 'Attendance selections cleared' });
    } catch (e: any) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: e.message });
    }
  }

  getStatus(studentId: string): AttendanceStatus | null {
    return this.svc.getStudentStatus(studentId);
  }

  saveAsDraft() {
    try {
      this.isSavingDraft.set(true);
      this.svc.saveDraft().subscribe({
        next: () => {
          this.isSavingDraft.set(false);
          this.messageService.add({ severity: 'success', summary: 'Draft Saved', detail: 'Local attendance sheet saved as draft' });
        },
        error: (err) => {
          this.isSavingDraft.set(false);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
        }
      });
    } catch (e: any) {
      this.isSavingDraft.set(false);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: e.message });
    }
  }

  lock() {
    this.svc.lockAttendance();
    this.messageService.add({ severity: 'warn', summary: 'Session Locked', detail: 'Attendance finalized and locked successfully.' });
  }

  reopen() {
    this.svc.reopenAttendance();
    this.messageService.add({ severity: 'info', summary: 'Session Reopened', detail: 'Attendance unlocked for edits.' });
  }

  submit() {
    const unmarked = this.summary().unmarked;
    if (unmarked > 0) {
      this.confirmationService.confirm({
        message: `There are ${unmarked} unmarked student(s). Are you sure you want to submit the attendance with incomplete markings?`,
        header: 'Incomplete Marking Warning',
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
          this.messageService.add({ severity: 'success', summary: 'Submitted', detail: 'Attendance saved successfully!' });
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message || 'Submission failed' });
        }
      });
    } catch (e: any) {
      this.isSubmitting.set(false);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: e.message });
    }
  }
}
