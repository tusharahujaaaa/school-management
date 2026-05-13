import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendance-percentage-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="surface-card shadow-1 border-round-xl p-4 text-center">
      <!-- Circular indicator (CSS-based) -->
      <div class="relative inline-flex align-items-center justify-content-center mb-3"
           style="width:7rem; height:7rem;">
        <svg viewBox="0 0 36 36" class="w-full h-full" style="transform: rotate(-90deg);">
          <circle cx="18" cy="18" r="15.9155" fill="none"
                  stroke="var(--surface-200)" stroke-width="2.5"/>
          <circle cx="18" cy="18" r="15.9155" fill="none"
                  [attr.stroke]="percentage >= 90 ? 'var(--green-500)' : percentage >= 75 ? 'var(--orange-400)' : 'var(--red-500)'"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  [attr.stroke-dasharray]="(percentage * 100 / 100) + ' 100'"
                  stroke-dashoffset="0"/>
        </svg>
        <div class="absolute flex flex-column align-items-center">
          <span class="font-bold text-xl text-900">{{ percentage }}%</span>
        </div>
      </div>
      <div class="text-700 font-semibold">{{ label }}</div>
      <div *ngIf="subLabel" class="text-500 text-sm mt-1">{{ subLabel }}</div>
      <div *ngIf="presentDays !== undefined" class="mt-2 text-sm text-500">
        {{ presentDays }} / {{ totalDays }} days present
      </div>
    </div>
  `
})
export class AttendancePercentageWidgetComponent {
  @Input({ required: true }) percentage!: number;
  @Input() label = 'Attendance';
  @Input() subLabel?: string;
  @Input() presentDays?: number;
  @Input() totalDays?: number;
}
