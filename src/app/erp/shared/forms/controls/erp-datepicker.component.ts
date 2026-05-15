import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { BaseControlValueAccessor } from '../utils/base-control';

@Component({
  selector: 'app-erp-datepicker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePickerModule],
  template: `
    <div class="erp-datepicker-wrapper">
      <p-datepicker
        [id]="id"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [ngModel]="value"
        (ngModelChange)="handleInputChange($event)"
        (onBlur)="onTouched()"
        styleClass="w-full"
        [showIcon]="true"
        [dateFormat]="dateFormat"
        [showOnFocus]="true"
        [appendTo]="'body'"
        [ngClass]="{'ng-invalid ng-dirty': controlDir?.invalid && controlDir?.touched}"
      ></p-datepicker>
    </div>
  `
})
export class ErpDatepickerComponent extends BaseControlValueAccessor<Date> {
  @Input() dateFormat = 'dd/mm/yy';
}
