import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FeesService } from '../../services/fees.service';
import { StudentService } from '../../../students/services/student.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';

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
    FormsModule
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

  paymentDialog = signal<boolean>(false);
  receiptDialog = signal<boolean>(false);
  classesList = signal<any[]>([]);

  selectedRecord = signal<any>(null);
  paymentForm!: FormGroup;

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
    this.feesService.loadFeeRecords(1);
  }

  initPaymentForm() {
    this.paymentForm = this.fb.group({
      paymentMode: ['CASH', Validators.required],
      paidDate: [new Date().toISOString().split('T')[0], Validators.required],
      remarks: ['']
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
    // Sync filters to FeesService
    this.feesService.filterStatus.set(this.statusFilter());
    
    // We filter list based on studentId search query or classId.
    // Since our backend handles student search through filtering, let's trigger reloading:
    this.feesService.loadFeeRecords(1);
  }

  onSearch(event: any) {
    const val = event?.target?.value || '';
    this.searchQuery.set(val);
    
    // If student name search query is entered, we match clientside or search on backend:
    // Wait, backend accepts studentId but not search query directly in `/fees/records`.
    // Let's reload to fetch matching records.
    this.feesService.loadFeeRecords(1);
  }

  // Client-side computed search filter matching searchQuery and classFilter
  filteredRecords = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const clsId = this.classFilter();
    const records = this.feesService.feeRecords();

    return records.filter(r => {
      const matchSearch = !query || 
        r.student?.name?.toLowerCase().includes(query) || 
        r.student?.rollNumber?.toLowerCase().includes(query);
      
      const matchClass = !clsId || r.student?.class?.id === clsId;
      
      return matchSearch && matchClass;
    });
  });

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

  getStatusClass(status: string): string {
    const s = (status || '').toUpperCase();
    if (s === 'PAID') return 'bg-green-50 text-green-700 border-green-200';
    if (s === 'PENDING') return 'bg-orange-50 text-orange-700 border-orange-200';
    if (s === 'OVERDUE') return 'bg-red-50 text-red-700 border-red-200';
    if (s === 'WAIVED') return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}
