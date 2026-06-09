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

@Component({
  selector: 'app-fee-structures',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    SelectModule
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
  classesList = signal<any[]>([]);
  
  structureForm!: FormGroup;

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

  ngOnInit() {
    this.feesService.loadFeeStructures();
    this.loadSetupClasses();
    this.initForm();
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

    const payload = this.structureForm.value;
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

  runInvoice(structureId: string) {
    this.feesService.runInvoiceGeneration(structureId).subscribe({
      next: (res: any) => {
        if (res?.success) {
          const detailMsg = res.data
            ? `Generated ${res.data.generated} invoices. Skipped ${res.data.skipped || 0} duplicates.`
            : 'Invoices generated successfully.';
          this.messageService.add({ severity: 'success', summary: 'Invoice Run Completed', detail: detailMsg });
        }
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Invoice Run Failed', detail: err?.error?.message || 'Unable to generate invoices.' });
      }
    });
  }

  getFeeTypeLabel(type: string): string {
    const found = this.feeTypes.find(t => t.value === type);
    return found ? found.label : type;
  }
}
