import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceStatus, StaffAttendanceStatus } from '../../models/attendance.model';

type AnyStatus = AttendanceStatus | StaffAttendanceStatus;

@Component({
  selector: 'app-attendance-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="inline-flex align-items-center gap-1 px-2 py-1 border-round-xl text-xs font-semibold" [ngClass]="badgeClass">
      <i [class]="icon" style="font-size:0.65rem"></i>
      {{ label }}
    </span>
  `
})
export class AttendanceStatusBadgeComponent {
  @Input() status!: AnyStatus;

  get label(): string {
    const labels: Record<string, string> = {
      present: 'Present', absent: 'Absent', late: 'Late',
      leave: 'Leave', 'half-day': 'Half Day'
    };
    return labels[this.status] ?? '—';
  }

  get icon(): string {
    const icons: Record<string, string> = {
      present: 'pi pi-check-circle', absent: 'pi pi-times-circle',
      late: 'pi pi-clock', leave: 'pi pi-calendar-minus', 'half-day': 'pi pi-circle-half'
    };
    return icons[this.status] ?? 'pi pi-minus';
  }

  get badgeClass(): string {
    const classes: Record<string, string> = {
      present: 'bg-green-100 text-green-700',
      absent: 'bg-red-100 text-red-700',
      late: 'bg-orange-100 text-orange-700',
      leave: 'bg-blue-100 text-blue-700',
      'half-day': 'bg-yellow-100 text-yellow-700'
    };
    return classes[this.status] ?? 'bg-surface-200 text-500';
  }
}
