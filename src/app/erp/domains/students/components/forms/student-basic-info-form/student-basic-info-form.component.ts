import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ErpInputComponent } from '../../../../../shared/forms/controls/erp-input.component';
import { ErpSelectComponent } from '../../../../../shared/forms/controls/erp-select.component';
import { ErpDatepickerComponent } from '../../../../../shared/forms/controls/erp-datepicker.component';
import { FormFieldComponent } from '../../../../../shared/forms/wrappers/form-field.component';
import { GENDER_OPTIONS } from '../../../constants/student.constants';
import { BLOOD_GROUP_OPTIONS } from '../../../constants/student-form.constants';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-student-basic-info-form',
  standalone: true,
  imports: [
        CommonModule, ReactiveFormsModule, ErpInputComponent, ErpSelectComponent, ErpDatepickerComponent, FormFieldComponent, TranslatePipe
    ],
  templateUrl: './student-basic-info-form.component.html'
})
export class StudentBasicInfoFormComponent {
  @Input({ required: true }) group!: FormGroup;

  genderOptions = GENDER_OPTIONS;
  bloodGroupOptions = BLOOD_GROUP_OPTIONS;
}
