import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { FormFieldComponent } from '../wrappers/form-field.component';
import { BaseControlValueAccessor } from './base-control';

@Component({
  selector: 'erp-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CalendarModule, FormFieldComponent],
  template: `
    <app-erp-form-field 
      [label]="label" 
      [required]="required" 
      [helperText]="helperText" 
      [control]="ngControl">
      
      <p-calendar
        [(ngModel)]="value"
        (ngModelChange)="onModelChange($event)"
        (onBlur)="onTouched()"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [showIcon]="true"
        [dateFormat]="dateFormat"
        [showTime]="showTime"
        [selectionMode]="selectionMode"
        styleClass="w-full"
        inputStyleClass="w-full"
        [ngClass]="{'p-invalid': ngControl?.invalid && ngControl?.touched}"
      ></p-calendar>

    </app-erp-form-field>
  `
})
export class DatePickerComponent extends BaseControlValueAccessor<Date> {
  @Input() dateFormat = 'dd/mm/yy';
  @Input() showTime = false;
  @Input() selectionMode: 'single' | 'multiple' | 'range' = 'single';
}
