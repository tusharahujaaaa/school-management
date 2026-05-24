import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatData } from '../../models/dashboard.model';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="surface-card shadow-1 p-3 border-round-xl hover:shadow-2 transition-all transition-duration-200 border-1 border-transparent hover:border-primary-100">
      <div class="flex justify-content-between mb-3">
        <div>
          <span class="block text-500 font-medium mb-3">{{ stat.title }}</span>
          <div class="text-900 font-bold text-2xl">{{ stat.value }}</div>
        </div>
        <div class="flex align-items-center justify-content-center border-round-lg" [ngClass]="stat.colorClass" style="width:3rem;height:3rem">
          <i [class]="stat.icon + ' text-xl'"></i>
        </div>
      </div>
      <span class="font-medium text-sm" [ngClass]="stat.trendUp ? 'text-green-500' : 'text-orange-500'">
        <i [class]="stat.trendUp ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" style="font-size: 0.75rem"></i>
        {{ stat.trendUp ? '+' : '' }}
      </span>
      <span class="text-500 text-sm ml-1">{{ stat.trend }}</span>
    </div>
  `
})
export class StatCardComponent {
  @Input() stat!: StatData;
}
