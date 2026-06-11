import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StudentService } from '../../../students/services/student.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-admit-student',
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
  templateUrl: './admit-student.component.html'
})
export class AdmitStudentComponent implements OnInit {
  private fb = inject(FormBuilder);
  private studentSvc = inject(StudentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  admitForm!: FormGroup;
  classesList = signal<any[]>([]);
  isLoading = signal<boolean>(false);

  genderOptions = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
    { label: 'Other', value: 'OTHER' }
  ];

  statusOptions = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' }
  ];

  ngOnInit() {
    this.initForm();
    this.loadClasses();
    this.checkPrefillParams();
  }

  initForm() {
    this.admitForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      classId: [null, Validators.required],
      rollNumber: [''],
      dateOfBirth: [null],
      gender: ['MALE', Validators.required],
      parentName: [''],
      parentPhone: ['', [Validators.required, Validators.pattern(/^[+]?[0-9\s-]{10,15}$/)]],
      parentEmail: ['', [Validators.email]],
      address: [''],
      photoUrl: [''],
      status: ['ACTIVE', Validators.required]
    });
  }

  loadClasses() {
    this.studentSvc.getSetupData().subscribe({
      next: (res: any) => {
        if (res?.success && res.data && Array.isArray(res.data.classes)) {
          const mapped = res.data.classes.map((c: any) => ({
            label: `${c.name} - Section ${c.section}`,
            value: c.id
          }));
          this.classesList.set(mapped);
        }
      },
      error: (err) => console.error('Error fetching classes list for enrollment:', err)
    });
  }

  checkPrefillParams() {
    // Check if redirecting from CRM lead convert action
    const queryParams = this.route.snapshot.queryParamMap;
    if (queryParams.has('name') || queryParams.has('parentPhone')) {
      let dobString = null;
      const rawDob = queryParams.get('dateOfBirth');
      if (rawDob) {
        dobString = rawDob.split('T')[0]; // format YYYY-MM-DD
      }

      this.admitForm.patchValue({
        name: queryParams.get('name') || '',
        gender: (queryParams.get('gender') || 'MALE').toUpperCase(),
        dateOfBirth: dobString,
        parentName: queryParams.get('parentName') || '',
        parentPhone: queryParams.get('parentPhone') || '',
        parentEmail: queryParams.get('parentEmail') || '',
        address: queryParams.get('address') || '',
        classId: queryParams.get('classId') || null
      });

      this.messageService.add({
        severity: 'info',
        summary: 'Form Prefilled',
        detail: 'Inquiry details mapped to enrollment fields.'
      });
    }
  }

  onSubmit() {
    if (this.admitForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Please fill in all required fields correctly.' });
      return;
    }

    this.isLoading.set(true);
    const formVal = this.admitForm.value;
    const payload: any = {
      ...formVal,
      photoUrl: formVal.photoUrl || null,
      parentEmail: formVal.parentEmail || null,
      address: formVal.address || null,
      rollNumber: formVal.rollNumber || null
    };

    if (formVal.dateOfBirth) {
      payload.dateOfBirth = new Date(formVal.dateOfBirth).toISOString();
    }

    this.studentSvc.createStudent(payload).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        if (res?.success) {
          this.messageService.add({ severity: 'success', summary: 'Student Admitted', detail: `${formVal.name} enrolled successfully!` });
          this.resetForm();
          
          // Optionally redirect to students directory
          setTimeout(() => {
            this.router.navigate(['/erp/students']);
          }, 1500);
        }
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Enrollment Failed', detail: err?.error?.message || 'Unable to enroll student.' });
      }
    });
  }

  resetForm() {
    this.admitForm.reset({
      name: '',
      classId: null,
      rollNumber: '',
      dateOfBirth: null,
      gender: 'MALE',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      address: '',
      photoUrl: '',
      status: 'ACTIVE'
    });
  }
}
