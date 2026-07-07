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
    const admNumCtrl = this.studentForm.get('admissionNumber');
    const rollNumCtrl = this.studentForm.get('rollNumber');
    const sessionCtrl = this.studentForm.get('academicSession');

    if (value) {
      // Enable fields for editing
      admNumCtrl?.enable();
      rollNumCtrl?.enable();

      // Enforce mandatory validation in edit mode
      admNumCtrl?.setValidators([Validators.required]);
      rollNumCtrl?.setValidators([Validators.required]);
      sessionCtrl?.setValidators([Validators.required]);

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
    } else {
      // Disable key generation fields during creation
      admNumCtrl?.disable();
      rollNumCtrl?.disable();

      // Clear required validation during creation
      admNumCtrl?.clearValidators();
      rollNumCtrl?.clearValidators();
      sessionCtrl?.clearValidators();
    }

    admNumCtrl?.updateValueAndValidity();
    rollNumCtrl?.updateValueAndValidity();
    sessionCtrl?.updateValueAndValidity();
  }

  @Input() loading = false;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  studentForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    middleName: ['', [Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    gender: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    bloodGroup: [''],

    admissionNumber: [{ value: '', disabled: true }],
    rollNumber: [{ value: '', disabled: true }],
    academicSession: [''],
    class: ['', Validators.required],
    section: ['', Validators.required],
    admissionDate: [null as string | null, Validators.required],
    status: ['Active', Validators.required],

    // Transport Fields
    usesTransport: [false],
    busId: [null as string | null],
    pickupPoint: ['', [Validators.maxLength(100)]],
    dropPoint: ['', [Validators.maxLength(100)]],

    contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    email: ['', [Validators.email, Validators.maxLength(100)]],
    emergencyContact: ['', [Validators.required, Validators.maxLength(100)]],

    address: ['', [Validators.required, Validators.maxLength(250)]],
    city: ['', [Validators.required, Validators.maxLength(100)]],
    state: ['', [Validators.required, Validators.maxLength(100)]],
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
