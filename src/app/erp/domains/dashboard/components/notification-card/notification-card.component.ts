import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationData } from '../../models/dashboard.model';

@Component({
  selector: 'app-notification-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="surface-card p-3 border-round-xl mb-3 flex align-items-start border-1 surface-border hover:surface-100 transition-colors">
      <i class="pi mt-1 mr-3 text-xl"
         [ngClass]="{
           'pi-exclamation-triangle text-orange-500': notification.type === 'warning',
           'pi-times-circle text-red-500': notification.type === 'danger',
           'pi-check-circle text-green-500': notification.type === 'success',
           'pi-info-circle text-blue-500': notification.type === 'info'
         }"></i>
      <div>
        <p class="m-0 text-900 line-height-3 mb-1">{{ notification.message }}</p>
        <span class="text-500 text-xs">{{ notification.time }}</span>
      </div>
    </div>
  `
})
export class NotificationCardComponent {
  @Input() notification!: NotificationData;
}
