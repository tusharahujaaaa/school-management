import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AttendanceService } from '../../services/attendance.service';
import { AttendanceStatusBadgeComponent } from '../../components/attendance-status-badge/attendance-status-badge.component';
import { StaffAttendanceStatus } from '../../models/attendance.model';

@Component({
  selector: 'app-staff-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule, InputTextModule, ButtonModule, ToastModule, AttendanceStatusBadgeComponent],
  providers: [MessageService],
  templateUrl: './staff-attendance.component.html',
  styleUrls: ['./staff-attendance.component.scss']
})
export class StaffAttendanceComponent {
  svc = inject(AttendanceService);
  private messageService = inject(MessageService);

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

  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
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
