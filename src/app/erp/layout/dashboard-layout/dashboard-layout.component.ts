import { Component, signal, inject, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ERP_BRANDING_CONFIG } from '../../config/branding.config';
import { AuthService } from '../../domains/auth/services/auth.service';
import { GlobalSearchComponent } from '../../shared/components/global-search/global-search.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { NotificationService } from '../../domains/dashboard/services/notification.service';
import { NotificationCardComponent } from '../../domains/dashboard/components/notification-card/notification-card.component';

@Component({
  selector: 'app-erp-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GlobalSearchComponent,
    SidebarComponent,
    NotificationCardComponent
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent {
  branding = ERP_BRANDING_CONFIG;
  sidebarVisible = signal(true);
  bellOpen = signal(false);

  private authService = inject(AuthService);
  private router = inject(Router);
  private elementRef = inject(ElementRef);
  readonly notificationService = inject(NotificationService);

  currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.bellOpen()) {
      const bellContainer = this.elementRef.nativeElement.querySelector('.bell-trigger-container');
      if (bellContainer && !bellContainer.contains(event.target)) {
        this.bellOpen.set(false);
      }
    }
  }

  toggleSidebar() {
    this.sidebarVisible.update(v => !v);
  }

  logout() {
    this.authService.logout();
  }

  toggleBell() {
    this.bellOpen.update(v => {
      const next = !v;
      if (next) {
        // Fetch notifications when opened
        this.notificationService.loadNotifications(3);
      }
      return next;
    });
  }

  loadMore() {
    this.notificationService.loadMore(3);
  }

  viewAll() {
    this.bellOpen.set(false);
    this.router.navigate(['/erp/notifications']);
  }

  onDropdownScroll(event: Event) {
    const target = event.target as HTMLElement;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 10) {
      if (this.notificationService.hasMore() && !this.notificationService.loading()) {
        this.loadMore();
      }
    }
  }
}
