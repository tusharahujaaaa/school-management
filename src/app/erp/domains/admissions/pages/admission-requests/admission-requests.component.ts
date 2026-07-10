import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdmissionsService } from '../../services/admissions.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-admission-requests',
  standalone: true,
  imports: [
        CommonModule, ReactiveFormsModule, FormsModule, ToastModule, DialogModule, ButtonModule, SelectModule, TextareaModule, InputTextModule, TranslatePipe
    ],
  providers: [MessageService],
  templateUrl: './admission-requests.component.html'
})
export class AdmissionRequestsComponent implements OnInit {
  protected admissionsService = inject(AdmissionsService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private router = inject(Router);

  statusDialog = signal<boolean>(false);
  selectedLead = signal<any>(null);
  statusForm!: FormGroup;

  // Filter signals
  selectedStatusFilter = signal<string>('');
  searchQuery = signal<string>('');

  statusFilters = [
    { label: 'All Statuses', value: '' },
    { label: 'New', value: 'NEW' },
    { label: 'Contacted', value: 'CONTACTED' },
    { label: 'Follow Up', value: 'FOLLOW_UP' },
    { label: 'Admitted', value: 'ADMITTED' },
    { label: 'Rejected', value: 'REJECTED' }
  ];

  pipelineStates = [
    { label: 'New', value: 'NEW' },
    { label: 'Contacted', value: 'CONTACTED' },
    { label: 'Follow Up', value: 'FOLLOW_UP' },
    { label: 'Admitted', value: 'ADMITTED' },
    { label: 'Rejected', value: 'REJECTED' }
  ];

  // Computed counters from active visible list (for dashboard display feedback)
  newLeadsCount = computed(() => this.admissionsService.leads().filter(l => l.status === 'NEW').length);
  followUpLeadsCount = computed(() => this.admissionsService.leads().filter(l => l.status === 'FOLLOW_UP').length);
  admittedLeadsCount = computed(() => this.admissionsService.leads().filter(l => l.status === 'ADMITTED').length);

  ngOnInit() {
    this.initStatusForm();
    this.admissionsService.loadLeads(1);
  }

  initStatusForm() {
    this.statusForm = this.fb.group({
      status: ['', Validators.required],
      notes: ['']
    });
  }

  onFilterChange() {
    this.admissionsService.filterStatus.set(this.selectedStatusFilter());
    this.admissionsService.loadLeads(1);
  }

  onSearch(event: any) {
    const val = event?.target?.value || '';
    this.searchQuery.set(val);
    this.admissionsService.searchQuery.set(val);
    this.admissionsService.loadLeads(1);
  }

  openStatusModal(lead: any) {
    this.selectedLead.set(lead);
    this.statusForm.reset({
      status: lead.status,
      notes: lead.notes || ''
    });
    this.statusDialog.set(true);
  }

  saveStatusChange() {
    if (this.statusForm.invalid || !this.selectedLead()) return;

    const leadId = this.selectedLead().id;
    const { status, notes } = this.statusForm.value;

    this.admissionsService.updateLead(leadId, status, notes).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.messageService.add({ severity: 'success', summary: 'Lead Updated', detail: 'Admission lead pipeline updated.' });
          this.admissionsService.loadLeads(this.admissionsService.currentPage());
          this.statusDialog.set(false);
        }
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Failed to Update', detail: err?.error?.message || 'Unable to update lead.' });
      }
    });
  }

  convertToStudent(lead: any) {
    this.router.navigate(['/erp/admissions/admit'], {
      queryParams: {
        name: lead.studentName,
        gender: lead.gender || 'MALE',
        dateOfBirth: lead.dateOfBirth || '',
        parentName: lead.parentName || '',
        parentPhone: lead.parentPhone,
        parentEmail: lead.parentEmail || '',
        address: lead.address || ''
      }
    });
  }

  getStatusClass(status: string): string {
    const s = (status || '').toUpperCase();
    if (s === 'ADMITTED') return 'bg-green-50 text-green-700 border-green-200';
    if (s === 'NEW') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (s === 'FOLLOW_UP') return 'bg-purple-50 text-purple-700 border-purple-200';
    if (s === 'CONTACTED') return 'bg-orange-50 text-orange-700 border-orange-200';
    if (s === 'REJECTED') return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}
