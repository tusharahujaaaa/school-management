import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StudentStore } from '../../store/student.store';
import { FeesHttpService } from '../../../fees/services/fees-http.service';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../../shared/ui/badges/status-badge.component';
import { AvatarModule } from 'primeng/avatar';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { HasPermissionDirective } from '../../../../core/permissions/directives/has-permission.directive';
import { ERP_PERMISSIONS } from '../../../../core/permissions/constants/permission.constants';
import { SkeletonLoaderComponent } from '@/app/erp/shared/ui/loaders/skeleton-loader.component';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    PageHeaderComponent, 
    StatusBadgeComponent,
    AvatarModule, 
    TabsModule, 
    CardModule,
    ButtonModule,
    TableModule,
    HasPermissionDirective,
    SkeletonLoaderComponent
  ],
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.scss'
})
export class StudentProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  protected store = inject(StudentStore);
  private feesHttpSvc = inject(FeesHttpService);
  
  readonly PERMISSIONS = ERP_PERMISSIONS;

  // Fee ledger local state signals
  studentLedger = signal<any>(null);
  loadingLedger = signal<boolean>(false);

  // Flattened and sorted fee records
  allRecords = computed(() => {
    const ledger = this.studentLedger();
    if (!ledger || !ledger.records) return [];
    
    // Flatten grouped lists (PENDING, PAID, OVERDUE, WAIVED, PARTIAL)
    const all = Object.values(ledger.records).flat() as any[];
    
    // Sort by createdAt descending
    return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  // Dynamic aggregates summary computed from ledger summary object
  ledgerSummary = computed(() => {
    const ledger = this.studentLedger();
    if (!ledger || !ledger.summary) {
      return { paid: 0, pending: 0, overdue: 0 };
    }
    const sum = ledger.summary;
    return {
      paid: Number(sum.PAID?.total || 0),
      pending: Number(sum.PENDING?.total || 0),
      overdue: Number(sum.OVERDUE?.total || 0)
    };
  });
  
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.selectStudent(id);
      this.loadFeeLedger(id);
    }
  }

  loadFeeLedger(studentId: string) {
    this.loadingLedger.set(true);
    this.feesHttpSvc.getStudentLedger(studentId).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.studentLedger.set(res.data);
        }
        this.loadingLedger.set(false);
      },
      error: (err: any) => {
        console.error('Error fetching student ledger:', err);
        this.loadingLedger.set(false);
      }
    });
  }

  getSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary' {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'danger';
      case 'Pending': return 'warning';
      case 'Graduated': return 'primary';
      case 'Transferred': return 'info';
      default: return 'neutral';
    }
  }

  getFeeStatusClass(status: string): string {
    const s = (status || '').toUpperCase();
    if (s === 'PAID') return 'bg-green-50 text-green-700 border-green-200';
    if (s === 'PENDING') return 'bg-orange-50 text-orange-700 border-orange-200';
    if (s === 'OVERDUE') return 'bg-red-50 text-red-700 border-red-200';
    if (s === 'WAIVED') return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}
