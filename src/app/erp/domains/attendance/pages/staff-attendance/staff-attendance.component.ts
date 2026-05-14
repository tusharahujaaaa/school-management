import { Component, inject, signal } from '@angular/core';
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
import { HasPermissionDirective } from '../../../../core/permissions/directives/has-permission.directive';
import { ERP_PERMISSIONS } from '../../../../core/permissions/constants/permission.constants';
import { StaffAttendanceStatus } from '../../models/attendance.model';

@Component({
  selector: 'app-staff-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule, InputTextModule, ButtonModule, ToastModule, PageHeaderComponent, ErpTableComponent, StatusBadgeComponent, HasPermissionDirective],
  providers: [MessageService],
  templateUrl: './staff-attendance.component.html',
  styleUrls: ['./staff-attendance.component.scss']
})
export class StaffAttendanceComponent {
  svc = inject(AttendanceService);
  private messageService = inject(MessageService);
  readonly PERMS = ERP_PERMISSIONS;

  searchQuery = signal('');
  isSubmitting = signal(false);

  staff = this.svc.filteredStaff;
  records = this.svc.staffRecords;

  readonly statusOptions: { label: string; value: StaffAttendanceStatus }[] = [
    { label: 'Present', value: 'present' },
    { label: 'Absent', value: 'absent' },
    { label: 'Late', value: 'late' },
    { label: 'Half Day', value: 'half-day' },
    { label: 'Leave', value: 'leave' }
  ];

  tableCols = [
    { field: 'employeeId', header: 'ID', sortable: true },
    { field: 'name', header: 'Staff Name', sortable: true },
    { field: 'department', header: 'Department', sortable: true },
    { field: 'status', header: 'Status' }
  ];

  getStatusSeverity(status: StaffAttendanceStatus | null): BadgeSeverity {
    if (!status) return 'neutral';
    const mapping: Record<StaffAttendanceStatus, BadgeSeverity> = {
      present: 'success',
      absent: 'danger',
      late: 'warning',
      'half-day': 'warning',
      leave: 'info'
    };
    return mapping[status] || 'neutral';
  }

  getStatusLabel(status: StaffAttendanceStatus | null): string {
    if (!status) return 'Unmarked';
    return status.replace('-', ' ').charAt(0).toUpperCase() + status.replace('-', ' ').slice(1);
  }

  onSearch(val: string) {
    this.searchQuery.set(val);
    this.svc.staffSearchQuery.set(val);
  }

  markStatus(staffId: string, status: StaffAttendanceStatus) {
    this.svc.markStaffAttendance(staffId, status);
  }

  markAllPresent() { this.svc.markAllStaff('present'); }
  reset() { this.svc.resetStaffAttendance(); }

  getStatus(staffId: string): StaffAttendanceStatus | null {
    return this.svc.getStaffStatus(staffId);
  }

  submit() {
    this.isSubmitting.set(true);
    this.svc.submitAttendance().subscribe(() => {
      this.isSubmitting.set(false);
      this.messageService.add({ severity: 'success', summary: 'Submitted', detail: 'Staff attendance saved!' });
    });
  }
}
