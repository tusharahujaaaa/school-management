import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendance-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="surface-card shadow-1 border-round-xl p-4 h-full hover:shadow-2 transition-all transition-duration-200">
      <div class="flex justify-content-between align-items-start mb-3">
        <div>
          <span class="block text-500 font-medium text-sm mb-2">{{ label }}</span>
          <div class="text-900 font-bold text-3xl">{{ value }}</div>
          <span *ngIf="subLabel" class="text-500 text-sm">{{ subLabel }}</span>
        </div>
        <div class="flex align-items-center justify-content-center border-round-xl" [ngClass]="iconBgClass" style="width:3rem;height:3rem">
          <i [class]="icon + ' text-xl'" [ngClass]="iconColorClass"></i>
        </div>
      </div>
      <div *ngIf="percentage !== undefined" class="mt-3">
        <div class="flex justify-content-between text-xs mb-1 font-medium">
          <span class="text-500">Percentage</span>
          <span class="font-semibold" [ngClass]="percentage >= 90 ? 'text-green-500' : percentage >= 75 ? 'text-orange-500' : 'text-red-500'">{{ percentage }}%</span>
        </div>
        <div class="w-full bg-surface-200 border-round" style="height:6px">
          <div class="border-round transition-all" style="height:6px"
               [ngClass]="percentage >= 90 ? 'bg-green-500' : percentage >= 75 ? 'bg-orange-500' : 'bg-red-500'"
               [style.width.%]="percentage"></div>
        </div>
      </div>
    </div>
  `
})
export class AttendanceStatCardComponent {
  @Input() label!: string;
  @Input() value!: string | number;
  @Input() subLabel?: string;
  @Input() icon!: string;
  @Input() iconBgClass!: string;
  @Input() iconColorClass!: string;
  @Input() percentage?: number;
}
