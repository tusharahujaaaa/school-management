import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LowAttendanceAlert } from '../../models/attendance.model';

@Component({
  selector: 'app-attendance-alert-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex align-items-center p-3 border-round-xl border-1 mb-2 transition-all hover:shadow-1"
         [ngClass]="alert.severity === 'critical' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'">
      <div class="flex align-items-center justify-content-center border-circle mr-3 flex-shrink-0"
           [ngClass]="alert.severity === 'critical' ? 'bg-red-100' : 'bg-orange-100'"
           style="width:2.5rem;height:2.5rem">
        <i class="pi pi-user" [ngClass]="alert.severity === 'critical' ? 'text-red-500' : 'text-orange-500'"></i>
      </div>
      <div class="flex-grow-1 min-w-0">
        <div class="flex justify-content-between align-items-center mb-1">
          <span class="font-semibold text-900 text-overflow-ellipsis overflow-hidden white-space-nowrap">{{ alert.studentName }}</span>
          <span class="ml-2 px-2 py-1 border-round text-xs font-bold flex-shrink-0"
                [ngClass]="alert.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'">
            {{ alert.attendancePercentage }}%
          </span>
        </div>
        <span class="text-500 text-sm">{{ alert.class }}-{{ alert.section }} &bull; {{ alert.presentDays }}/{{ alert.totalDays }} days</span>
      </div>
    </div>
  `
})
export class AttendanceAlertCardComponent {
  @Input() alert!: LowAttendanceAlert;
}
