import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FeesService } from '../../services/fees.service';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-fee-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TooltipModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './fee-dashboard.component.html',
  styleUrls: ['./fee-dashboard.component.scss']
})
export class FeeDashboardComponent implements OnInit {
  feesService = inject(FeesService);
  router = inject(Router);
  messageService = inject(MessageService);
  
  markingOverdue = signal(false);

  ngOnInit() {
    this.feesService.loadDashboardData();
  }

  navigateTo(path: string) {
    this.router.navigate([`/erp/fees/${path}`]);
  }

  runMarkOverdue() {
    this.markingOverdue.set(true);
    this.feesService.markOverdueRecords().subscribe({
      next: (res: any) => {
        this.markingOverdue.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Scan Complete',
          detail: `${res?.data?.updated || 0} overdue invoices marked successfully.`
        });
        // Reload dashboard stats to show updated Overdue counts
        this.feesService.loadDashboardData();
      },
      error: (err: any) => {
        this.markingOverdue.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Scan Failed',
          detail: err?.error?.message || 'Unable to scan past due invoices.'
        });
      }
    });
  }

  getPaymentModeIcon(mode: string): string {
    const m = (mode || '').toUpperCase();
    if (m === 'ONLINE') return 'pi pi-globe text-blue-500';
    if (m === 'CASH') return 'pi pi-wallet text-green-500';
    if (m === 'CHEQUE') return 'pi pi-ticket text-orange-500';
    return 'pi pi-credit-card text-purple-500';
  }
}
