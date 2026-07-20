import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { FeesService } from '../../services/fees.service';
import { StudentService } from '../../../students/services/student.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { HasPermissionDirective } from '../../../../core/permissions/directives/has-permission.directive';
import { ERP_PERMISSIONS } from '../../../../core/permissions/constants/permission.constants';

@Component({
  selector: 'app-fee-records',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    SelectModule,
    TableModule,
    FormsModule,
    HasPermissionDirective
  ],
  providers: [MessageService],
  templateUrl: './fee-records.component.html',
  styleUrls: ['./fee-records.component.scss']
})
export class FeeRecordsComponent implements OnInit {
  feesService = inject(FeesService);
  studentSvc = inject(StudentService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  readonly PERMISSIONS = ERP_PERMISSIONS;
  readonly todayStr = new Date().toISOString().split('T')[0];

  paymentDialog = signal<boolean>(false);
  receiptDialog = signal<boolean>(false);
  waiveDialog = signal<boolean>(false);
  classesList = signal<any[]>([]);

  selectedRecord = signal<any>(null);
  paymentForm!: FormGroup;
  waiverForm!: FormGroup;

  statuses = [
    { label: 'All Statuses', value: '' },
    { label: 'Paid', value: 'PAID' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Overdue', value: 'OVERDUE' },
    { label: 'Waived', value: 'WAIVED' },
    { label: 'Partial', value: 'PARTIAL' }
  ];

  paymentModes = [
    { label: 'Cash', value: 'CASH' },
    { label: 'Cheque', value: 'CHEQUE' },
    { label: 'Bank Transfer', value: 'BANK_TRANSFER' },
    { label: 'Online Payment', value: 'ONLINE' }
  ];

  // Filters state mapping to signals
  classFilter = signal<string>('');
  statusFilter = signal<string>('');
  searchQuery = signal<string>('');

  ngOnInit() {
    this.initPaymentForm();
    this.loadSetupClasses();
    this.feesService.loadSessions();
    this.feesService.loadFeeRecords(1);
  }

  noFutureDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const selected = new Date(control.value);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return selected > today ? { futureDate: true } : null;
  }

  initPaymentForm() {
    this.paymentForm = this.fb.group({
      paymentMode: ['CASH', Validators.required],
      paidDate: [new Date().toISOString().split('T')[0], [Validators.required, this.noFutureDate]],
      remarks: ['']
    });
    this.waiverForm = this.fb.group({
      remarks: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  loadSetupClasses() {
    this.studentSvc.getSetupData().subscribe({
      next: (res: any) => {
        if (res?.success && res.data && Array.isArray(res.data.classes)) {
          const mapped = res.data.classes.map((c: any) => ({
            label: `${c.name} ${c.section}`,
            value: c.id
          }));
          this.classesList.set([{ label: 'All Classes', value: '' }, ...mapped]);
        }
      },
      error: (err: any) => console.error('Error listing classes for filters:', err)
    });
  }

  onFilterChange() {
    this.feesService.filterStatus.set(this.statusFilter());
    this.feesService.filterClassId.set(this.classFilter());
    this.feesService.loadFeeRecords(1);
  }

  onSearch(event: any) {
    const val = event?.target?.value || '';
    this.searchQuery.set(val);
    this.feesService.filterSearch.set(val);
    this.feesService.loadFeeRecords(1);
  }

  // Returned directly from service (fully server-side paginated & filtered list)
  filteredRecords = computed(() => this.feesService.feeRecords());

  openPaymentModal(record: any) {
    this.selectedRecord.set(record);
    this.paymentForm.reset({
      paymentMode: 'CASH',
      paidDate: new Date().toISOString().split('T')[0],
      remarks: ''
    });
    this.paymentDialog.set(true);
  }

  submitPayment() {
    if (this.paymentForm.invalid || !this.selectedRecord()) return;

    const payload = this.paymentForm.value;
    const recordId = this.selectedRecord().id;

    this.feesService.collectPayment(recordId, payload).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.messageService.add({ severity: 'success', summary: 'Payment Recorded', detail: 'Manual billing payment updated.' });
          this.feesService.loadFeeRecords(this.feesService.currentPage());
          this.paymentDialog.set(false);
        }
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Failed', detail: err?.error?.message || 'Unable to log payment.' });
      }
    });
  }

  openReceiptModal(record: any) {
    this.selectedRecord.set(record);
    this.receiptDialog.set(true);
  }

  printReceipt() {
    window.print();
  }

  openWaiveModal(record: any) {
    this.selectedRecord.set(record);
    this.waiverForm.reset({
      remarks: ''
    });
    this.waiveDialog.set(true);
  }

  submitWaiver() {
    if (this.waiverForm.invalid || !this.selectedRecord()) return;

    const recordId = this.selectedRecord().id;
    const remarks = this.waiverForm.value.remarks;

    this.feesService.waiveRecord(recordId, remarks).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.messageService.add({ severity: 'success', summary: 'Fee Waived', detail: 'The fee record has been successfully waived.' });
          this.feesService.loadFeeRecords(this.feesService.currentPage());
          this.waiveDialog.set(false);
        }
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Waiver Failed', detail: err?.error?.message || 'Unable to waive the fee record.' });
      }
    });
  }

  markOverdueRecords() {
    if (this.feesService.markingOverdue()) return;

    this.feesService.markOverdueRecords().subscribe({
      next: (res: any) => {
        if (res?.success) {
          const updated = Number(res.data?.updated || 0);
          this.messageService.add({
            severity: updated > 0 ? 'success' : 'info',
            summary: 'Overdue Scan Complete',
            detail: updated > 0
              ? `${updated} pending invoice${updated === 1 ? '' : 's'} marked as overdue.`
              : 'No pending invoices were past their due date.'
          });
          console.log('Overdue scan result:', this.feesService.currentPage());
          this.feesService.loadFeeRecords(this.feesService.currentPage());
          this.feesService.loadDashboardData();
        }
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Overdue Scan Failed',
          detail: err?.error?.message || 'Unable to mark overdue fee records.'
        });
      }
    });
  }

  getStatusClass(status: string): string {
    const s = (status || '').toUpperCase();
    if (s === 'PAID') return 'bg-green-50 text-green-700 border-green-200';
    if (s === 'PENDING') return 'bg-orange-50 text-orange-700 border-orange-200';
    if (s === 'OVERDUE') return 'bg-red-50 text-red-700 border-red-200';
    if (s === 'WAIVED') return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}
