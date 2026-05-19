import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ErpInputComponent } from '../../../../../shared/forms/controls/erp-input.component';
import { ErpSelectComponent } from '../../../../../shared/forms/controls/erp-select.component';
import { ErpDatepickerComponent } from '../../../../../shared/forms/controls/erp-datepicker.component';
import { FormFieldComponent } from '../../../../../shared/forms/wrappers/form-field.component';
import { STUDENT_STATUS_OPTIONS } from '../../../constants/student.constants';
import { ACADEMIC_SESSION_OPTIONS } from '../../../constants/student-form.constants';
import { StudentStore } from '../../../store/student.store';

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

  private store = inject(StudentStore);

  statusOptions = STUDENT_STATUS_OPTIONS;
  sessionOptions = ACADEMIC_SESSION_OPTIONS;

  get classes() {
    return this.store.classes().map(c => ({ label: c, value: c }));
  }

  get sections() {
    return this.store.sections().map(s => ({ label: `Section ${s}`, value: s }));
  }
}
