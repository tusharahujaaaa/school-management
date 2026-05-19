import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ErpInputComponent } from '../../../../../shared/forms/controls/erp-input.component';
import { ErpSelectComponent } from '../../../../../shared/forms/controls/erp-select.component';
import { ErpDatepickerComponent } from '../../../../../shared/forms/controls/erp-datepicker.component';
import { FormFieldComponent } from '../../../../../shared/forms/wrappers/form-field.component';
import { STUDENT_STATUS_OPTIONS } from '../../../constants/student.constants';
import { ACADEMIC_SESSION_OPTIONS } from '../../../constants/student-form.constants';

@Component({
  selector: 'app-student-academic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ErpInputComponent,
    ErpSelectComponent,
    ErpDatepickerComponent,
    FormFieldComponent
  ],
  templateUrl: './student-academic-form.component.html'
})
export class StudentAcademicFormComponent {
  @Input({ required: true }) group!: FormGroup;

  statusOptions = STUDENT_STATUS_OPTIONS;
  sessionOptions = ACADEMIC_SESSION_OPTIONS;

  classes = [
    { label: 'Class 9', value: '9' },
    { label: 'Class 10', value: '10' },
    { label: 'Class 11', value: '11' },
    { label: 'Class 12', value: '12' }
  ];

  sections = [
    { label: 'Section A', value: 'A' },
    { label: 'Section B', value: 'B' },
    { label: 'Section C', value: 'C' }
  ];
}
