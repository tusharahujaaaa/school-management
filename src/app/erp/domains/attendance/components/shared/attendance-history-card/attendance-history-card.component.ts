import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceHistoryRecord } from '../../../models/attendance.model';

@Component({
  selector: 'app-attendance-history-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="surface-card shadow-1 border-round-xl p-4 hover:shadow-2 transition-all">
      <div class="flex justify-content-between align-items-center mb-3">
        <div>
          <span class="text-500 text-sm"><i class="pi pi-calendar mr-1"></i>{{ record.date | date:'dd MMM yyyy' }}</span>
          <div class="text-900 font-bold text-lg mt-1">{{ record.class }} - Section {{ record.section }}</div>
        </div>
        <div class="text-2xl font-bold"
             [ngClass]="record.percentage >= 90 ? 'text-green-500' : record.percentage >= 75 ? 'text-orange-500' : 'text-red-500'">
          {{ record.percentage }}%
        </div>
      </div>
      <div class="flex gap-3">
        <div class="flex align-items-center gap-1">
          <span class="w-2rem h-2rem border-circle bg-green-100 flex align-items-center justify-content-center text-xs font-bold text-green-700">{{ record.present }}</span>
          <span class="text-500 text-xs">Present</span>
        </div>
        <div class="flex align-items-center gap-1">
          <span class="w-2rem h-2rem border-circle bg-red-100 flex align-items-center justify-content-center text-xs font-bold text-red-700">{{ record.absent }}</span>
          <span class="text-500 text-xs">Absent</span>
        </div>
        <div class="flex align-items-center gap-1 ml-auto">
          <span class="text-400 text-xs">by {{ record.markedBy }}</span>
        </div>
      </div>
      <div class="w-full bg-surface-200 border-round mt-3" style="height:5px">
        <div class="border-round h-full"
             [ngClass]="record.percentage >= 90 ? 'bg-green-500' : record.percentage >= 75 ? 'bg-orange-400' : 'bg-red-500'"
             [style.width.%]="record.percentage"></div>
      </div>
    </div>
  `
})
export class AttendanceHistoryCardComponent {
  @Input({ required: true }) record!: AttendanceHistoryRecord;
}
