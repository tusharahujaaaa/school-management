import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../domains/dashboard/services/notification.service';
import { NotificationData } from '../../domains/dashboard/models/dashboard.model';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-page-container max-w-5xl mx-auto py-4">
      <!-- Header -->
      <div class="flex flex-column sm:flex-row justify-content-between align-items-start sm:align-items-center gap-3 mb-4">
        <div>
          <h1 class="m-0 mb-1 text-900 font-bold text-3xl flex align-items-center gap-2">
            <i class="pi pi-bell text-primary"></i>
            <span>System Notifications</span>
          </h1>
          <p class="m-0 text-500">Monitor all system events, student alerts, and staff requests here.</p>
        </div>
        <div class="flex gap-2">
          <button class="p-button p-button-outlined p-button-secondary border-round-xl px-3 py-2 flex align-items-center gap-2" 
                  (click)="clearAll()" 
                  [disabled]="notificationService.allNotifications().length === 0">
            <i class="pi pi-trash"></i>
            <span>Clear All</span>
          </button>
        </div>
      </div>

      <!-- Filters & Counter -->
      <div class="surface-card p-3 border-round-xl shadow-1 mb-4 flex flex-column md:flex-row md:align-items-center justify-content-between gap-3 border-1 surface-border">
        <!-- Filter Tabs -->
        <div class="flex flex-wrap gap-2">
          <button *ngFor="let tab of tabs" 
                  class="p-link px-3 py-2 border-round-lg text-sm font-semibold transition-all duration-200"
                  [class.active-tab]="activeTab() === tab.id"
                  [class.inactive-tab]="activeTab() !== tab.id"
                  (click)="setTab(tab.id)">
            <i class="pi mr-2 {{ tab.icon }}"></i>
            <span>{{ tab.label }}</span>
          </button>
        </div>
        <!-- Status Indicator -->
        <span class="text-600 text-sm font-medium">
          Showing {{ filteredNotifications().length }} of {{ notificationService.allNotifications().length }} notifications
        </span>
      </div>

      <!-- Notifications List -->
      <div class="notifications-list-container">
        <!-- Skeletons (Initial Load) -->
        <div *ngIf="notificationService.loading() && displayList().length === 0" class="flex flex-column gap-3">
          <div *ngFor="let i of [1,2,3,4]" class="surface-card p-4 border-round-xl shadow-1 border-1 surface-border flex align-items-start gap-4 animate-pulse-container">
            <div class="w-3rem h-3rem border-round bg-gray-200 flex-shrink-0 animate-pulse"></div>
            <div class="flex-grow-1 flex flex-column gap-2">
              <div class="h-1.5rem bg-gray-200 border-round animate-pulse w-70"></div>
              <div class="h-1rem bg-gray-200 border-round animate-pulse w-30"></div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div *ngIf="!notificationService.loading() && filteredNotifications().length === 0" class="surface-card p-8 border-round-xl shadow-1 border-1 surface-border text-center flex flex-column align-items-center justify-content-center">
          <div class="w-4rem h-4rem border-circle bg-gray-50 flex align-items-center justify-content-center mb-4">
            <i class="pi pi-bell-slash text-400 text-3xl"></i>
          </div>
          <h3 class="m-0 mb-2 text-900 font-bold text-xl">All clear!</h3>
          <p class="m-0 text-500 max-w-20rem mb-4">There are no notifications matching the selected filter right now.</p>
          <button class="p-button p-button-primary border-round-xl px-4 py-2" (click)="setTab('all')">
            Reset Filter
          </button>
        </div>

        <!-- Notification cards list -->
        <div *ngIf="displayList().length > 0" class="flex flex-column gap-3">
          <div *ngFor="let notif of displayList()" 
               class="surface-card p-4 border-round-xl shadow-1 border-1 surface-border hover:shadow-2 transition-all duration-200 flex align-items-start border-left-3 hover:surface-100"
               [ngClass]="{
                 'border-left-orange-500': notif.type === 'warning',
                 'border-left-red-500': notif.type === 'danger',
                 'border-left-green-500': notif.type === 'success',
                 'border-left-blue-500': notif.type === 'info'
               }">
            <div class="notification-icon-wrapper w-3rem h-3rem border-round flex align-items-center justify-content-center flex-shrink-0 mr-4"
                 [ngClass]="{
                   'bg-orange-50 text-orange-500': notif.type === 'warning',
                   'bg-red-50 text-red-500': notif.type === 'danger',
                   'bg-green-50 text-green-500': notif.type === 'success',
                   'bg-blue-50 text-blue-500': notif.type === 'info'
                 }">
              <i class="pi text-xl"
                 [ngClass]="{
                   'pi-exclamation-triangle': notif.type === 'warning',
                   'pi-times-circle': notif.type === 'danger',
                   'pi-check-circle': notif.type === 'success',
                   'pi-info-circle': notif.type === 'info'
                 }"></i>
            </div>
            <div class="flex-grow-1">
              <div class="flex justify-content-between align-items-start mb-2">
                <span class="text-950 font-semibold text-lg line-height-3 pr-4">{{ notif.message }}</span>
                <span class="text-500 text-xs font-semibold whitespace-nowrap mt-1">{{ notif.time }}</span>
              </div>
              <div class="flex align-items-center gap-2">
                <span class="text-xs font-bold uppercase tracking-wider px-2 py-1 border-round-md"
                      [ngClass]="{
                        'bg-orange-50 text-orange-600': notif.type === 'warning',
                        'bg-red-50 text-red-600': notif.type === 'danger',
                        'bg-green-50 text-green-600': notif.type === 'success',
                        'bg-blue-50 text-blue-600': notif.type === 'info'
                      }">
                  {{ notif.type }}
                </span>
                <span class="text-400 text-xs">•</span>
                <span class="text-500 text-xs">System Alert</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Skeletons (Load More) -->
        <div *ngIf="notificationService.loading() && displayList().length > 0" class="flex flex-column gap-3 mt-3">
          <div class="surface-card p-4 border-round-xl shadow-1 border-1 surface-border flex align-items-start gap-4">
            <div class="w-3rem h-3rem border-round bg-gray-200 animate-pulse flex-shrink-0"></div>
            <div class="flex-grow-1 flex flex-column gap-2">
              <div class="h-1.5rem bg-gray-200 border-round animate-pulse w-70"></div>
              <div class="h-1rem bg-gray-200 border-round animate-pulse w-30"></div>
            </div>
          </div>
        </div>

        <!-- Load More Section -->
        <div *ngIf="hasMoreFiltered() && !notificationService.loading()" class="text-center mt-5">
          <button class="p-button p-button-primary border-round-xl px-5 py-3 font-semibold shadow-1 hover:shadow-3 flex align-items-center gap-2 mx-auto"
                  (click)="loadMore()">
            <span>Load More Notifications</span>
            <i class="pi pi-chevron-down"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .active-tab {
      background-color: var(--primary-color, #3b82f6);
      color: var(--primary-color-text, #ffffff) !important;
      box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2), 0 2px 4px -1px rgba(59, 130, 246, 0.1);
    }
    .inactive-tab {
      background-color: transparent;
      color: var(--text-color-secondary, #64748b);
      border: 1px solid transparent;
    }
    .inactive-tab:hover {
      background-color: var(--surface-hover, #f1f5f9);
      color: var(--text-color, #1e293b);
    }
    .bg-gray-200 {
      background-color: var(--surface-200, #e2e8f0);
    }
    .animate-pulse {
      animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: .5; }
    }
    .border-left-orange-500 { border-left: 4px solid var(--orange-500, #f97316) !important; }
    .border-left-red-500 { border-left: 4px solid var(--red-500, #ef4444) !important; }
    .border-left-green-500 { border-left: 4px solid var(--green-500, #22c55e) !important; }
    .border-left-blue-500 { border-left: 4px solid var(--blue-500, #3b82f6) !important; }
  `]
})
export class NotificationsComponent implements OnInit {
  readonly notificationService = inject(NotificationService);

  // Tabs layout configuration
  tabs = [
    { id: 'all', label: 'All', icon: 'pi-envelope' },
    { id: 'warning', label: 'Warnings', icon: 'pi-exclamation-triangle' },
    { id: 'danger', label: 'Danger', icon: 'pi-times-circle' },
    { id: 'success', label: 'Success', icon: 'pi-check-circle' },
    { id: 'info', label: 'Info', icon: 'pi-info-circle' },
  ];

  // Component local states
  activeTab = signal<string>('all');
  pageSize = signal<number>(5); // Show first 5 items initially for the page
  currentPageLimit = signal<number>(5);

  // Filters notifications according to the tab
  filteredNotifications = computed(() => {
    const filter = this.activeTab();
    const list = this.notificationService.allNotifications();
    if (filter === 'all') return list;
    return list.filter((n: NotificationData) => n.type === filter);
  });

  // Displayed subset of filtered notifications (implements page-level lazy loading)
  displayList = computed(() => {
    const limit = this.currentPageLimit();
    return this.filteredNotifications().slice(0, limit);
  });

  // Checks if there are more filtered notifications to display
  hasMoreFiltered = computed(() => {
    return this.displayList().length < this.filteredNotifications().length;
  });

  ngOnInit() {
    // Initial fetch of notifications (page wants more items initially)
    this.notificationService.loadNotifications(10);
  }

  setTab(tabId: string) {
    this.activeTab.set(tabId);
    this.currentPageLimit.set(this.pageSize()); // Reset display page limit on tab change
  }

  loadMore() {
    this.notificationService.loading.set(true);
    // Simulate minor network delay for loading more page items
    setTimeout(() => {
      this.currentPageLimit.update(limit => limit + this.pageSize());
      this.notificationService.loading.set(false);
    }, 400);
  }

  clearAll() {
    this.notificationService.clearAll();
  }
}
