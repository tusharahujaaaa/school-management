import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
export class SidebarComponent {
  private authService = inject(AuthService);
  private permissionService = inject(PermissionService);

  branding = ERP_BRANDING_CONFIG;

  /**
   * Reads the current role directly from AuthService signal.
   */
  readonly currentRole = this.authService.currentRole;

  /**
   * Filtered navigation groups — items are filtered by permissions and roles.
   * Priority: permissionKey > roles > visible to all.
   */
  readonly filteredGroups = computed<SidebarGroup[]>(() => {
    const role = this.currentRole();
    
    return ERP_SIDEBAR_CONFIG
      .map(group => ({
        ...group,
        items: group.items.filter(item => {
          // 1. Check by Permission Key (Primary)
          if (item.permissionKey) {
            return this.permissionService.hasPermission(item.permissionKey);
          }

          // 2. Check by Roles (Legacy/Fallback)
          if (item.roles && item.roles.length > 0) {
            return item.roles.includes(role);
          }

          // 3. Visible to all if no constraints
          return true;
        })
      }))
      .filter(group => group.items.length > 0);
  });

  isLink(item: SidebarNavItem): boolean {
    return item.type === 'link';
  }
}
