import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { StudentBasicInfoFormComponent } from './student-basic-info-form/student-basic-info-form.component';
import { StudentAcademicFormComponent } from './student-academic-form/student-academic-form.component';
import { StudentContactFormComponent } from './student-contact-form/student-contact-form.component';
import { StudentAddressFormComponent } from './student-address-form/student-address-form.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StudentBasicInfoFormComponent,
    StudentAcademicFormComponent,
    StudentContactFormComponent,
    StudentAddressFormComponent,
    ButtonModule,
    CardModule
  ],
  templateUrl: './student-form.component.html'
})
export class StudentFormComponent {
  private fb = inject(FormBuilder);

  @Input() set student(value: Student | null | undefined) {
    if (value) {
      const patchData: any = { ...value };
      
      // Parse ISO Date strings to Date objects for datepicker controls compatibility
      if (value.dateOfBirth) {
        patchData.dateOfBirth = new Date(value.dateOfBirth);
      }
      if (value.admissionDate) {
        patchData.admissionDate = new Date(value.admissionDate);
      }
      
      if (value.busAssignment) {
        patchData.usesTransport = true;
        patchData.busId = value.busAssignment.busId;
        patchData.pickupPoint = value.busAssignment.pickupPoint || '';
        patchData.dropPoint = value.busAssignment.dropPoint || '';
      } else {
        patchData.usesTransport = false;
        patchData.busId = null;
        patchData.pickupPoint = '';
        patchData.dropPoint = '';
      }
      this.studentForm.patchValue(patchData);
    }
  }

  @Input() loading = false;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  studentForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    middleName: [''],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    gender: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    bloodGroup: [''],

    admissionNumber: ['', Validators.required],
    rollNumber: ['', Validators.required],
    academicSession: ['', Validators.required],
    class: ['', Validators.required],
    section: ['', Validators.required],
    admissionDate: [null as string | null, Validators.required],
    status: ['Active', Validators.required],

    // Transport Fields
    usesTransport: [false],
    busId: [null as string | null],
    pickupPoint: [''],
    dropPoint: [''],

    contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    email: ['', [Validators.email]],
    emergencyContact: ['', Validators.required],

    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
  });

  onSubmit() {
    if (this.studentForm.valid) {
      this.save.emit(this.studentForm.value);
    } else {
      this.studentForm.markAllAsTouched();
    }
  }
}
