import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-erp-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: string | number;
  @Input({ required: true }) icon!: string;
  
  /** PrimeFlex bg class e.g., 'bg-blue-100 text-blue-500' */
  @Input() iconBgClass: string = 'bg-primary-100 text-primary-500';
  
  @Input() trendLabel?: string;
  @Input() trendDesc?: string;
  @Input() trendUp: boolean = true;
}
