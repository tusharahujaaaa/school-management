import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ERP_BRANDING_CONFIG } from '../../config/branding.config';
import { AuthService } from '../../domains/auth/services/auth.service';

@Component({
  selector: 'app-erp-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
