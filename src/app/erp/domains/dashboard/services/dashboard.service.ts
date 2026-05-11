import { Injectable, signal } from '@angular/core';
import { MOCK_STATS, MOCK_ACTIVITIES, MOCK_EVENTS, MOCK_NOTIFICATIONS, MOCK_QUICK_ACTIONS } from '../store/dashboard.mock';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  stats = signal(MOCK_STATS);
  activities = signal(MOCK_ACTIVITIES);
  events = signal(MOCK_EVENTS);
  notifications = signal(MOCK_NOTIFICATIONS);
  quickActions = signal(MOCK_QUICK_ACTIONS);
}
