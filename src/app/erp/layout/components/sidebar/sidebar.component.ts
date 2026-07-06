import { Component, inject, computed, Input, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { ERP_SIDEBAR_CONFIG } from './sidebar.config';
import { SidebarGroup, SidebarNavItem } from './sidebar.model';
import { AuthService } from '../../../domains/auth/services/auth.service';
import { PermissionService } from '../../../core/permissions/services/permission.service';
import { ERP_BRANDING_CONFIG } from '../../../config/branding.config';

@Component({
  selector: 'app-erp-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() collapsed = false;

  private authService = inject(AuthService);
  private permissionService = inject(PermissionService);
  private router = inject(Router);
  private routerSub?: Subscription;

  branding = ERP_BRANDING_CONFIG;

  readonly currentRole = this.authService.currentRole;

  readonly filteredGroups = computed<SidebarGroup[]>(() => {
    const role = this.currentRole();
    return ERP_SIDEBAR_CONFIG
      .map(group => ({
        ...group,
        items: group.items.filter(item => {
          // If the item restricts visibility to specific roles, the user's role must match
          if (item.roles && item.roles.length > 0 && !item.roles.includes(role)) {
            return false;
          }
          // If the item requires a specific permission, the user must have it
          if (item.permissionKey && !this.permissionService.hasPermission(item.permissionKey)) {
            return false;
          }
          return true;
        })
      }))
      .filter(group => group.items.length > 0);
  });

  isLink(item: SidebarNavItem): boolean {
    return item.type === 'link';
  }

  // Tracks which groups are explicitly expanded (all collapsed by default)
  expandedGroups = signal<Record<string, boolean>>({});

  ngOnInit() {
    // Expand the active group immediately on load (handles reloads / direct URL access)
    this.expandActiveGroup(this.router.url);

    // Re-expand whenever navigation completes (handles in-app navigation)
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => this.expandActiveGroup(e.urlAfterRedirects ?? e.url));
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  /**
   * Walks filtered groups and expands the one whose items include a route
   * that matches the beginning of the given URL.
   */
  private expandActiveGroup(url: string) {
    const cleanUrl = url.split('?')[0]; // strip query params
    for (const group of this.filteredGroups()) {
      if (!group.groupLabel) continue;
      const hasActive = group.items.some(item => item.route && cleanUrl.startsWith(item.route));
      if (hasActive) {
        this.expandedGroups.update(s => ({ ...s, [group.groupLabel!]: true }));
      }
    }
  }

  toggleGroup(label?: string) {
    if (!label || this.collapsed) return;
    this.expandedGroups.update((states: Record<string, boolean>) => ({
      ...states,
      [label]: !states[label]
    }));
  }

  isGroupCollapsed(label?: string): boolean {
    if (!label || this.collapsed) return false;
    return !this.expandedGroups()[label];
  }
}

