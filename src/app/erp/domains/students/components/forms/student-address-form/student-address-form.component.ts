import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ErpInputComponent } from '../../../../../shared/forms/controls/erp-input.component';
import { FormFieldComponent } from '../../../../../shared/forms/wrappers/form-field.component';
import { ErpTextareaComponent } from '../../../../../shared/forms/controls/erp-textarea.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-student-address-form',
  standalone: true,
  imports: [
        CommonModule, ReactiveFormsModule, ErpInputComponent, FormFieldComponent, ErpTextareaComponent, TranslatePipe
    ],
  templateUrl: './student-address-form.component.html'
})
export class StudentAddressFormComponent {
  @Input({ required: true }) group!: FormGroup;
}
