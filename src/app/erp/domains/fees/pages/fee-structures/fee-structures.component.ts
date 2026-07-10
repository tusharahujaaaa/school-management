import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FeesService } from '../../services/fees.service';
import { StudentService } from '../../../students/services/student.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-fee-structures',
  standalone: true,
  imports: [
        CommonModule, ReactiveFormsModule, ToastModule, DialogModule, ButtonModule, SelectModule, TranslatePipe
    ],
  providers: [MessageService],
  templateUrl: './fee-structures.component.html',
  styleUrls: ['./fee-structures.component.scss']
})
export class FeeStructuresComponent implements OnInit {
  feesService = inject(FeesService);
  studentSvc = inject(StudentService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  displayDialog = signal<boolean>(false);
  displayBillingDialog = signal<boolean>(false);
  classesList = signal<any[]>([]);
  selectedStructure = signal<any>(null);
  
  structureForm!: FormGroup;
  billingForm!: FormGroup;

  feeTypes = [
    { label: 'Tuition Fee', value: 'TUITION' },
    { label: 'Admission Fee', value: 'ADMISSION' },
    { label: 'Exam Fee', value: 'EXAM' },
    { label: 'Bus Fee', value: 'BUS' },
    { label: 'Library Fee', value: 'LIBRARY' },
    { label: 'Sports Fee', value: 'SPORTS' },
    { label: 'Miscellaneous Fee', value: 'MISCELLANEOUS' }
  ];

  frequencies = [
    { label: 'Monthly', value: 'MONTHLY' },
    { label: 'Quarterly', value: 'QUARTERLY' },
    { label: 'Annual', value: 'ANNUAL' },
    { label: 'One-Time', value: 'ONE_TIME' }
  ];

  monthsList = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 }
  ];

  ngOnInit() {
    this.feesService.loadFeeStructures();
    this.feesService.loadSessions();
    this.loadSetupClasses();
    this.initForm();
    this.initBillingForm();
  }

  initForm() {
    this.structureForm = this.fb.group({
      classId: [null], // Null means applies to all classes
      feeType: ['TUITION', Validators.required],
      label: ['', [Validators.required, Validators.minLength(3)]],
      amount: [null, [Validators.required, Validators.min(1)]],
      frequency: ['MONTHLY', Validators.required],
      dueDay: [10, [Validators.required, Validators.min(1), Validators.max(28)]]
    });
  }

  initBillingForm() {
    this.billingForm = this.fb.group({
      sessionId: ['', Validators.required],
      month: [new Date().getMonth() + 1, Validators.required],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(2020), Validators.max(2100)]]
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
          this.classesList.set([{ label: 'All Classes (Global)', value: null }, ...mapped]);
        }
      },
      error: (err: any) => console.error('Error fetching classes list for structures:', err)
    });
  }

  openNewDialog() {
    this.structureForm.reset({
      classId: null,
      feeType: 'TUITION',
      label: '',
      amount: null,
      frequency: 'MONTHLY',
      dueDay: 10
    });
    this.displayDialog.set(true);
  }

  onSubmit() {
    if (this.structureForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Please fill in all required fields correctly.' });
      return;
    }

    const payload = {
      ...this.structureForm.value,
      sessionId: this.feesService.activeSession()?.id || null
    };

    this.feesService.createStructure(payload).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.messageService.add({ severity: 'success', summary: 'Created', detail: 'Fee structure template defined successfully.' });
          this.feesService.loadFeeStructures();
          this.displayDialog.set(false);
        }
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Creation Failed', detail: err?.error?.message || 'Unable to define fee structure.' });
      }
    });
  }

  runInvoice(struct: any) {
    this.selectedStructure.set(struct);
    this.billingForm.reset({
      sessionId: this.feesService.activeSession()?.id || '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    });
    this.displayBillingDialog.set(true);
  }

  submitBillingRun() {
    if (this.billingForm.invalid || !this.selectedStructure()) {
      return;
    }

    const struct = this.selectedStructure();
    const payload = {
      sessionId: this.billingForm.value.sessionId,
      month: Number(this.billingForm.value.month),
      year: Number(this.billingForm.value.year),
      feeType: struct.feeType,
      classId: struct.classId || undefined
    };

    this.feesService.runInvoiceGeneration(payload).subscribe({
      next: (res: any) => {
        if (res?.success) {
          const detailMsg = res.data
            ? `Generated ${res.data.generated} invoices. Skipped ${res.data.skipped || 0} duplicates.`
            : 'Invoices generated successfully.';
          this.messageService.add({ severity: 'success', summary: 'Invoice Run Completed', detail: detailMsg });
          this.displayBillingDialog.set(false);
        }
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Invoice Run Failed', detail: err?.error?.message || 'Unable to generate invoices.' });
      }
    });
  }

  deleteStructure(structureId: string) {
    if (confirm('Are you sure you want to delete this fee structure template? This action cannot be undone.')) {
      this.feesService.deleteStructure(structureId).subscribe({
        next: (res: any) => {
          if (res?.success) {
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Fee structure template deleted successfully.' });
            this.feesService.loadFeeStructures();
          }
        },
        error: (err: any) => {
          this.messageService.add({ severity: 'error', summary: 'Deletion Failed', detail: err?.error?.message || 'Unable to delete fee structure.' });
        }
      });
    }
  }

  getFeeTypeLabel(type: string): string {
    const found = this.feeTypes.find(t => t.value === type);
    return found ? found.label : type;
  }
}
