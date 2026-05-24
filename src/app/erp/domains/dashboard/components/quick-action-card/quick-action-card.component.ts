import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickAction } from '../../models/dashboard.model';

@Component({
  selector: 'app-quick-action-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-3 border-round-xl border-1 cursor-pointer transition-colors transition-duration-200 flex flex-column align-items-center justify-content-center text-center h-full shadow-1 hover:shadow-2"
         [ngClass]="action.colorClass">
      <i [class]="action.icon + ' text-2xl mb-2'"></i>
      <span class="font-medium">{{ action.label }}</span>
    </div>
  `
})
export class QuickActionCardComponent {
  @Input() action!: QuickAction;
}
