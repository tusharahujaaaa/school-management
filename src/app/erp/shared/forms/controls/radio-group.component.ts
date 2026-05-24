import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormFieldComponent } from '../wrappers/form-field.component';
import { BaseControlValueAccessor } from './base-control';
import { ERPFormOption } from '../models/form.models';

@Component({
  selector: 'erp-radio-group',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RadioButtonModule, FormFieldComponent],
  template: `
    <app-erp-form-field 
      [label]="label" 
      [required]="required" 
      [helperText]="helperText" 
      [control]="ngControl">
      
      <div class="flex flex-wrap gap-3">
        <div *ngFor="let option of options" class="flex align-items-center">
          <p-radiobutton
            [name]="label || 'radio'"
            [value]="option.value"
            [(ngModel)]="value"
            (ngModelChange)="onModelChange($event)"
            [inputId]="option.label"
            [disabled]="disabled || option.disabled"
          ></p-radiobutton>
          <label [for]="option.label" class="ml-2 cursor-pointer">{{ option.label }}</label>
        </div>
      </div>

    </app-erp-form-field>
  `
})
export class RadioGroupComponent extends BaseControlValueAccessor<any> {
  @Input() options: ERPFormOption[] = [];
}
