import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../services/dashboard.service';
import { ERP_BRANDING_CONFIG } from '../../../config/branding.config';

import { SectionHeaderComponent } from '../components/section-header/section-header.component';
import { StatCardComponent } from '../components/stat-card/stat-card.component';
import { QuickActionCardComponent } from '../components/quick-action-card/quick-action-card.component';
import { ActivityListComponent } from '../components/activity-list/activity-list.component';
import { EventCardComponent } from '../components/event-card/event-card.component';
import { NotificationCardComponent } from '../components/notification-card/notification-card.component';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-erp-home',
  standalone: true,
  imports: [
    CommonModule,
    SectionHeaderComponent,
    StatCardComponent,
    QuickActionCardComponent,
    ActivityListComponent,
    EventCardComponent,
    NotificationCardComponent,
    ProgressBarModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  branding = ERP_BRANDING_CONFIG;
  dashboardService = inject(DashboardService);

  stats = this.dashboardService.stats;
  activities = this.dashboardService.activities;
  events = this.dashboardService.events;
  notifications = this.dashboardService.notifications;
  quickActions = this.dashboardService.quickActions;

  currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  academicSession = '2026 - 2027';
}
