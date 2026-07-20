import { Injectable, signal, computed } from '@angular/core';
import { BaseApiService } from '../../../core/api/base/base-api.service';
import { NotificationData } from '../models/dashboard.model';
import { catchError, of, delay } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/api/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseApiService {
  // Store all loaded notifications (source of truth)
  readonly allNotifications = signal<NotificationData[]>([]);

  // Sliced notifications currently displayed (simulates lazy loading)
  readonly notifications = signal<NotificationData[]>([]);

  // Loading state
  readonly loading = signal<boolean>(false);

  // Checks if there are more notifications to load
  readonly hasMore = computed(() => this.notifications().length < this.allNotifications().length);

  /**
   * Fetches notifications from the server or falls back to mock data.
   * Resets the lazy loading slices.
   * @param initialSize The initial number of notifications to show.
   */
  loadNotifications(initialSize = 3) {
    this.loading.set(true);
    
    // Using a slight artificial delay (500ms) to ensure the skeleton loaders are visible for premium UX
    this.get<any>(API_ENDPOINTS.DASHBOARD.ADMIN_NOTIFICATIONS)
      .pipe(
        delay(500),
        catchError(() => {
          console.warn('Notifications API failed.');
          return of({ success: false, data: [] });
        })
      )
      .subscribe({
        next: (res) => {
          let data: NotificationData[] = [];
          if (res && res.success && Array.isArray(res.data)) {
            data = res.data;
          }

          this.allNotifications.set(data);
          // Load the first slice
          this.notifications.set(data.slice(0, initialSize));
          this.loading.set(false);
        },
        error: () => {
          this.allNotifications.set([]);
          this.notifications.set([]);
          this.loading.set(false);
        }
      });
  }

  /**
   * Appends the next batch of notifications (slicing)
   * @param batchSize Number of items to load next
   */
  loadMore(batchSize = 3) {
    const currentLen = this.notifications().length;
    const all = this.allNotifications();
    if (currentLen >= all.length) return;

    this.loading.set(true);
    // Simulate minor network delay for loading more
    setTimeout(() => {
      const nextSlice = all.slice(0, currentLen + batchSize);
      this.notifications.set(nextSlice);
      this.loading.set(false);
    }, 400);
  }

  /**
   * Clear all displayed notifications
   */
  clearAll() {
    this.allNotifications.set([]);
    this.notifications.set([]);
  }
}
