import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceDashboardStats } from '../../../models/attendance.model';

@Component({
  selector: 'app-attendance-summary-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid">
      <!-- Overall Percentage -->
      <div class="col-12">
        <div class="surface-card shadow-1 border-round-xl p-4 border-left-4 border-left-primary">
          <div class="flex justify-content-between align-items-center mb-3">
            <div>
              <span class="text-500 font-medium text-sm block mb-1">Overall Attendance</span>
              <span class="text-4xl font-bold"
                [ngClass]="stats.overallPercentage >= 90 ? 'text-green-500' : stats.overallPercentage >= 75 ? 'text-orange-500' : 'text-red-500'">
                {{ stats.overallPercentage }}%
              </span>
            </div>
            <div class="flex align-items-center justify-content-center border-round-xl bg-green-50" style="width:3rem;height:3rem">
              <i class="pi pi-check-circle text-green-500 text-2xl"></i>
            </div>
          </div>
          <!-- Progress bar -->
          <div class="w-full bg-surface-200 border-round" style="height:8px">
            <div class="border-round h-full transition-all"
                 [ngClass]="stats.overallPercentage >= 90 ? 'bg-green-500' : stats.overallPercentage >= 75 ? 'bg-orange-400' : 'bg-red-500'"
                 [style.width.%]="stats.overallPercentage"></div>
          </div>
        </div>
      </div>
      <!-- Mini Stat Chips -->
      <div class="col-6 md:col-3">
        <div class="surface-card shadow-1 border-round-xl p-3 text-center">
          <div class="text-green-600 font-bold text-2xl">{{ stats.presentToday }}</div>
          <span class="text-500 text-xs font-medium">Present</span>
        </div>
      </div>
      <div class="col-6 md:col-3">
        <div class="surface-card shadow-1 border-round-xl p-3 text-center">
          <div class="text-red-500 font-bold text-2xl">{{ stats.absentToday }}</div>
          <span class="text-500 text-xs font-medium">Absent</span>
        </div>
      </div>
      <div class="col-6 md:col-3">
        <div class="surface-card shadow-1 border-round-xl p-3 text-center">
          <div class="text-orange-500 font-bold text-2xl">{{ stats.lateToday }}</div>
          <span class="text-500 text-xs font-medium">Late</span>
        </div>
      </div>
      <div class="col-6 md:col-3">
        <div class="surface-card shadow-1 border-round-xl p-3 text-center">
          <div class="text-blue-500 font-bold text-2xl">{{ stats.onLeave }}</div>
          <span class="text-500 text-xs font-medium">On Leave</span>
        </div>
      </div>
    </div>
  `
})
export class AttendanceSummaryWidgetComponent {
  @Input({ required: true }) stats!: AttendanceDashboardStats;
}
