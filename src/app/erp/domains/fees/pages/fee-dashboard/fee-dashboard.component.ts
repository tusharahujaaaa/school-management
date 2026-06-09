import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FeesService } from '../../services/fees.service';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-fee-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TooltipModule,
    ButtonModule
  ],
  templateUrl: './fee-dashboard.component.html',
  styleUrls: ['./fee-dashboard.component.scss']
})
export class FeeDashboardComponent implements OnInit {
  feesService = inject(FeesService);
  router = inject(Router);

  ngOnInit() {
    this.feesService.loadDashboardData();
  }

  navigateTo(path: string) {
    this.router.navigate([`/erp/fees/${path}`]);
  }

  getPaymentModeIcon(mode: string): string {
    const m = (mode || '').toUpperCase();
    if (m === 'ONLINE') return 'pi pi-globe text-blue-500';
    if (m === 'CASH') return 'pi pi-wallet text-green-500';
    if (m === 'CHEQUE') return 'pi pi-ticket text-orange-500';
    return 'pi pi-credit-card text-purple-500';
  }
}
