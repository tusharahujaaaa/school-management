import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdmissionsService } from '../../services/admissions.service';
import { AuthService } from '../../../auth/services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-admission-inquiry',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    ButtonModule,
    SelectModule,
    TextareaModule,
    InputTextModule
  ],
  providers: [MessageService],
  templateUrl: './admission-inquiry.component.html'
})
export class AdmissionInquiryComponent implements OnInit {
  private fb = inject(FormBuilder);
  protected admissionsService = inject(AdmissionsService);
  private authSvc = inject(AuthService);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  inquiryForm!: FormGroup;
  resolvedSchoolId = signal<string>('');

  genderOptions = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
    { label: 'Other', value: 'OTHER' }
  ];

  ngOnInit() {
    this.initForm();
    this.resolveSchoolContext();
  }

  initForm() {
    this.inquiryForm = this.fb.group({
      studentName: ['', [Validators.required, Validators.minLength(3)]],
      dateOfBirth: [null],
      gender: ['MALE'],
      classApplying: [''],
      parentName: [''],
      parentPhone: ['', [Validators.required, Validators.pattern(/^[+]?[0-9\s-]{10,15}$/)]],
      parentEmail: ['', [Validators.email]],
      address: [''],
      message: ['']
    });
  }

  getSchoolIdFromSession(): string {
    const userStr = sessionStorage.getItem('erp_temp_user_data');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        return u.schoolId || '';
      } catch (e) {
        // ignore
      }
    }
    return '';
  }

  resolveSchoolContext() {
    // 1. Check logged-in session context (convenience for admins inside the ERP portal)
    const sessionSchoolId = this.getSchoolIdFromSession();
    if (sessionSchoolId) {
      this.resolvedSchoolId.set(sessionSchoolId);
      return;
    }

    // 2. Check for domain parameter in the URL route parameter (e.g. /admission-inquiry/:domain)
    const routeDomain = this.route.snapshot.paramMap.get('domain');
    if (routeDomain) {
      this.fetchSchoolIdByDomain(routeDomain);
      return;
    }

    // 3. Fall back to current window hostname (multitenant domains)
    let hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      hostname = 'demo.campushandle.com'; // Local development fallback
    }
    this.fetchSchoolIdByDomain(hostname);
  }

  private fetchSchoolIdByDomain(domain: string) {
    this.admissionsService.resolveSchoolByDomain(domain).subscribe({
      next: (res: any) => {
        if (res?.success && res.data?.school?.id) {
          this.resolvedSchoolId.set(res.data.school.id);
        } else {
          this.resolvedSchoolId.set('3b29c9ef-b328-48b4-82ee-c88f28fa9fe3'); // default fallback ID
        }
      },
      error: () => {
        this.resolvedSchoolId.set('3b29c9ef-b328-48b4-82ee-c88f28fa9fe3'); // default fallback ID
      }
    });
  }

  onSubmit() {
    if (this.inquiryForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Please resolve form issues first.' });
      return;
    }

    const schoolId = this.resolvedSchoolId();
    if (!schoolId) {
      this.messageService.add({ severity: 'error', summary: 'Session Error', detail: 'Unable to identify active school context.' });
      return;
    }

    const formVal = this.inquiryForm.value;
    const payload: any = {
      ...formVal,
      schoolId,
      gender: formVal.gender
    };

    if (formVal.dateOfBirth) {
      payload.dateOfBirth = new Date(formVal.dateOfBirth).toISOString();
    }

    // Clean up empty optional fields to avoid backend null constraints
    Object.keys(payload).forEach(key => {
      if (payload[key] === '' || payload[key] === null || payload[key] === undefined) {
        delete payload[key];
      }
    });

    this.admissionsService.submitLeadInquiry(payload).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Admission inquiry submitted successfully.' });
          this.resetForm();
        }
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Submission Failed', detail: err?.error?.message || 'Unable to submit inquiry.' });
      }
    });
  }

  resetForm() {
    this.inquiryForm.reset({
      studentName: '',
      dateOfBirth: null,
      gender: 'MALE',
      classApplying: '',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      address: '',
      message: ''
    });
  }
}
