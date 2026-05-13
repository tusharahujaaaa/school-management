import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ERP_SIDEBAR_CONFIG } from './sidebar.config';
import { SidebarGroup, SidebarNavItem } from './sidebar.model';
import { AuthService } from '../../../domains/auth/services/auth.service';
import { ERP_BRANDING_CONFIG } from '../../../config/branding.config';

@Component({
  selector: 'app-erp-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  private authService = inject(AuthService);

  branding = ERP_BRANDING_CONFIG;

  /**
   * Reads the current role directly from AuthService signal.
   * Replace the underlying signal value with JWT claims once backend is ready.
   */
  readonly currentRole = this.authService.currentRole;

  /**
   * Filtered navigation groups — items are filtered by role.
   * Items with no `roles` defined are visible to all roles.
   */
  readonly filteredGroups = computed<SidebarGroup[]>(() => {
    const role = this.currentRole();
    return ERP_SIDEBAR_CONFIG
      .map(group => ({
        ...group,
        items: group.items.filter(item =>
          !item.roles || item.roles.length === 0 || item.roles.includes(role)
        )
      }))
      .filter(group => group.items.length > 0);
  });

  isLink(item: SidebarNavItem): boolean {
    return item.type === 'link';
  }
}
