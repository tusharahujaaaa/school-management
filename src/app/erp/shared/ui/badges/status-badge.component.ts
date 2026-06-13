import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeSeverity = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';

@Component({
  selector: 'app-erp-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent {
  /** The text to display inside the badge */
  @Input({ required: true }) label!: string;
  
  /** The visual severity/color scheme */
  @Input() severity: BadgeSeverity = 'neutral';
  
  /** Optional icon class (e.g., 'pi pi-check') */
  @Input() icon?: string;

  /** Computed classes based on severity */
  get badgeClass(): string {
    const classes: Record<BadgeSeverity, string> = {
      success: 'bg-green-100 text-green-700',
      danger:  'bg-red-100 text-red-700',
      warning: 'bg-orange-100 text-orange-700',
      info:    'bg-blue-100 text-blue-700',
      primary: 'bg-primary-100 text-primary-700',
      neutral: 'bg-surface-200 text-600'
    };
    return classes[this.severity] || classes.neutral;
  }
}
