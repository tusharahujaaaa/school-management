import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StudentService } from '../../../students/services/student.service';
import { ClassesService } from '@/app/erp/domains/academics/services/classes.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';

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
    InputTextModule,
    CheckboxModule
  ],
  providers: [MessageService],
  templateUrl: './admit-student.component.html'
})
export class AdmitStudentComponent implements OnInit {
  private fb = inject(FormBuilder);
  private studentSvc = inject(StudentService);
  private classesService = inject(ClassesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  admitForm!: FormGroup;
  classesList = signal<any[]>([]);
  busesList = signal<any[]>([]);
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

  busOptions = computed(() => {
    return this.busesList().map(b => ({
      label: `${b.plateNumber || 'No Plate'} (${b.routeName})`,
      value: b.id
    }));
  });

  ngOnInit() {
    this.initForm();
    this.loadClasses();
    this.loadBuses();
    this.setupTransportValidation();
    this.checkPrefillParams();
  }

  initForm() {
    this.admitForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      classId: [null, Validators.required],
      rollNumber: [{ value: '', disabled: true }],
      dateOfBirth: [null],
      gender: ['MALE', Validators.required],
      parentName: [''],
      parentPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      parentEmail: ['', [Validators.email]],
      address: ['', Validators.required],
      photoUrl: [''],
      status: ['ACTIVE', Validators.required],
      
      // Transport Fields
      usesTransport: [false],
      busId: [null as string | null],
      pickupPoint: [''],
      dropPoint: ['']
    });
  }

  setupTransportValidation() {
    const usesCtrl = this.admitForm.get('usesTransport');
    const busCtrl = this.admitForm.get('busId');
    
    if (usesCtrl && busCtrl) {
      usesCtrl.valueChanges.subscribe(uses => {
        if (uses) {
          busCtrl.setValidators([Validators.required]);
        } else {
          busCtrl.clearValidators();
          busCtrl.setValue(null);
          this.admitForm.get('pickupPoint')?.setValue('');
          this.admitForm.get('dropPoint')?.setValue('');
        }
        busCtrl.updateValueAndValidity();
      });
    }
  }

  loadBuses() {
    this.studentSvc.getBuses().subscribe({
      next: (res: any) => {
        if (res?.success && Array.isArray(res.data)) {
          this.busesList.set(res.data);
        }
      },
      error: (err) => console.error('Error fetching buses for admissions form:', err)
    });
  }

  loadClasses() {
    this.classesService.loadSessions();
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

    const activeSess = this.classesService.activeSession() || this.classesService.sessions()[0];
    const sessionId = activeSess?.id;

    if (!sessionId) {
      this.messageService.add({ severity: 'error', summary: 'Session Error', detail: 'Unable to resolve active academic session ID.' });
      this.isLoading.set(false);
      return;
    }

    const payload = {
      personalInfo: {
        name: formVal.name,
        dateOfBirth: formVal.dateOfBirth ? new Date(formVal.dateOfBirth).toISOString() : null,
        gender: formVal.gender.toUpperCase(),
        photoUrl: formVal.photoUrl || null
      },
      parentInfo: {
        fatherName: formVal.parentName || 'Parent',
        fatherPhone: formVal.parentPhone,
        fatherEmail: formVal.parentEmail || null,
        address: formVal.address
      },
      academicInfo: {
        classId: formVal.classId,
        sessionId,
        rollNumber: formVal.rollNumber || null
      },
      services: {
        usesTransport: formVal.usesTransport || false,
        busId: formVal.usesTransport ? formVal.busId : null,
        pickupPoint: formVal.usesTransport ? formVal.pickupPoint : '',
        dropPoint: formVal.usesTransport ? formVal.dropPoint : ''
      }
    };

    this.studentSvc.createStudent(payload).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        if (res?.success) {
          this.messageService.add({ severity: 'success', summary: 'Student Admitted', detail: `${formVal.name} enrolled successfully!` });
          
          if (res.data?.studentAccount?.isDummy) {
            this.messageService.add({ severity: 'info', summary: 'Student Credentials', detail: `Dummy Email: ${res.data.studentAccount.email}`, life: 10000 });
          }
          if (res.data?.parentAccount?.isDummy) {
            this.messageService.add({ severity: 'info', summary: 'Parent Credentials', detail: `Dummy Email: ${res.data.parentAccount.email}`, life: 10000 });
          }

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
      status: 'ACTIVE',
      usesTransport: false,
      busId: null,
      pickupPoint: '',
      dropPoint: ''
    });
  }
}
