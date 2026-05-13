import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ERP_BRANDING_CONFIG } from '../../config/branding.config';
import { AuthService } from '../../domains/auth/services/auth.service';
import { GlobalSearchComponent } from '../../shared/components/global-search/global-search.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'app-erp-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, GlobalSearchComponent, SidebarComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent {
  branding = ERP_BRANDING_CONFIG;
  sidebarVisible = signal(true);

  private authService = inject(AuthService);

  toggleSidebar() {
    this.sidebarVisible.update(v => !v);
  }

  logout() {
    this.authService.logout();
  }
}
