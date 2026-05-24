import { Injectable, signal, inject } from '@angular/core';
import { BaseApiService } from '../../../core/api/base/base-api.service';
import { StatData, ActivityData, EventData, NotificationData, QuickAction } from '../models/dashboard.model';
import { MOCK_EVENTS, MOCK_NOTIFICATIONS, MOCK_QUICK_ACTIONS } from '../store/dashboard.mock';
import { forkJoin, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseApiService {
  
  // Writable Signals
  stats = signal<StatData[]>([]);
  activities = signal<ActivityData[]>([]);
  events = signal<EventData[]>(MOCK_EVENTS); // Dynamic placeholder fallback
  notifications = signal<NotificationData[]>(MOCK_NOTIFICATIONS); // Dynamic placeholder fallback
  quickActions = signal<QuickAction[]>(MOCK_QUICK_ACTIONS);

  constructor() {
    super();
    this.loadDashboardData();
  }

  /**
   * Load stats and recent activity logs from the backend API simultaneously
   */
  loadDashboardData() {
    forkJoin({
      stats: this.get<any>('/dashboard/admin/stats').pipe(catchError(() => of(null))),
      activities: this.get<any>('/dashboard/admin/recent-activities').pipe(catchError(() => of(null))),
      notifications: this.get<any>('/dashboard/admin/notifications').pipe(catchError(() => of(null))),
      events: this.get<any>('/dashboard/admin/events').pipe(catchError(() => of(null)))
    }).subscribe(({ stats, activities, notifications, events }) => {
      
      // 1. Map dynamic admin stats cards
      if (stats && stats.success && stats.data) {
        const d = stats.data;
        const mappedStats: StatData[] = [
          { 
            title: 'Total Students', 
            value: d.totalStudents?.toLocaleString() || '0', 
            icon: 'pi pi-users', 
            trend: 'Active enrolled list', 
            trendUp: true, 
            colorClass: 'bg-blue-50 text-blue-600' 
          },
          { 
            title: 'Total Staff', 
            value: d.totalStaff?.toLocaleString() || '0', 
            icon: 'pi pi-id-card', 
            trend: 'System administrators', 
            trendUp: true, 
            colorClass: 'bg-purple-50 text-purple-600' 
          },
          { 
            title: 'Today Attendance', 
            value: (d.todayAttendancePercentage || 0) + '%', 
            icon: 'pi pi-check-circle', 
            trend: 'Live daily tracking', 
            trendUp: (d.todayAttendancePercentage || 0) > 85, 
            colorClass: 'bg-green-50 text-green-600' 
          },
          { 
            title: 'Pending Fees', 
            value: '$' + (d.pendingFees?.toLocaleString() || '0'), 
            icon: 'pi pi-dollar', 
            trend: 'Total outstanding dues', 
            trendUp: false, 
            colorClass: 'bg-orange-50 text-orange-600' 
          },
          { 
            title: 'Active Classes', 
            value: d.activeClasses?.toString() || '0', 
            icon: 'pi pi-building', 
            trend: 'Organized course units', 
            trendUp: true, 
            colorClass: 'bg-cyan-50 text-cyan-600' 
          },
          { 
            title: 'New Admissions', 
            value: d.newAdmissions?.toString() || '0', 
            icon: 'pi pi-user-plus', 
            trend: 'Registered last 30 days', 
            trendUp: true, 
            colorClass: 'bg-teal-50 text-teal-600' 
          }
        ];
        this.stats.set(mappedStats);
      } else {
        // Fallback default structure
        this.stats.set([
          { title: 'Total Students', value: '0', icon: 'pi pi-users', trend: 'Offline data fallback', trendUp: false, colorClass: 'bg-blue-50 text-blue-600' },
          { title: 'Total Staff', value: '0', icon: 'pi pi-id-card', trend: 'Offline data fallback', trendUp: false, colorClass: 'bg-purple-50 text-purple-600' },
          { title: 'Today Attendance', value: '0%', icon: 'pi pi-check-circle', trend: 'Offline data fallback', trendUp: false, colorClass: 'bg-green-50 text-green-600' },
          { title: 'Pending Fees', value: '$0', icon: 'pi pi-dollar', trend: 'Offline data fallback', trendUp: false, colorClass: 'bg-orange-50 text-orange-600' },
          { title: 'Active Classes', value: '0', icon: 'pi pi-building', trend: 'Offline data fallback', trendUp: false, colorClass: 'bg-cyan-50 text-cyan-600' },
          { title: 'New Admissions', value: '0', icon: 'pi pi-user-plus', trend: 'Offline data fallback', trendUp: false, colorClass: 'bg-teal-50 text-teal-600' }
        ]);
      }

      // 2. Map dynamic recent activities log
      if (activities && activities.success && Array.isArray(activities.data) && activities.data.length > 0) {
        const mappedActivities: ActivityData[] = activities.data.map((item: any, index: number) => {
          const type = item.activityType || 'SYSTEM';
          
          let icon = 'pi pi-info-circle';
          let colorClass = 'text-blue-500 bg-blue-50';
          
          if (type === 'STUDENT_ADDED') {
            icon = 'pi pi-user-plus';
            colorClass = 'text-green-500 bg-green-50';
          } else if (type === 'ADMISSION_LEAD') {
            icon = 'pi pi-envelope';
            colorClass = 'text-teal-500 bg-teal-50';
          }

          // Format relative time or return standard stamp
          const dateStr = item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now';

          return {
            id: index.toString(),
            title: item.title || 'System Activity',
            description: item.description || '',
            time: dateStr,
            icon,
            colorClass
          };
        });
        this.activities.set(mappedActivities);
      } else {
        this.activities.set([
          { id: '1', title: 'System Audited', description: 'Real-time database listener initialized', time: 'Just now', icon: 'pi pi-shield', colorClass: 'text-green-500 bg-green-50' }
        ]);
      }

      // 3. Map dynamic notifications if any exist in the database
      if (notifications && notifications.success && Array.isArray(notifications.data) && notifications.data.length > 0) {
        this.notifications.set(notifications.data);
      }

      // 4. Map dynamic calendar events if any exist in the database
      if (events && events.success && Array.isArray(events.data) && events.data.length > 0) {
        this.events.set(events.data);
      }
    });
  }
}
