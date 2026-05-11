import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityData } from '../../models/dashboard.model';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ul class="list-none p-0 m-0">
      <li *ngFor="let activity of activities; let last = last" class="flex align-items-start py-3" [ngClass]="{'border-bottom-1 surface-border': !last}">
        <div class="flex align-items-center justify-content-center border-circle mr-3 flex-shrink-0" [ngClass]="activity.colorClass" style="width: 2.5rem; height: 2.5rem">
          <i [class]="activity.icon"></i>
        </div>
        <div class="flex-grow-1">
          <div class="flex align-items-center justify-content-between mb-1">
            <span class="text-900 font-medium">{{ activity.title }}</span>
            <span class="text-500 text-sm">{{ activity.time }}</span>
          </div>
          <p class="text-600 m-0 text-sm line-height-3">{{ activity.description }}</p>
        </div>
      </li>
    </ul>
  `
})
export class ActivityListComponent {
  @Input() activities: ActivityData[] = [];
}
