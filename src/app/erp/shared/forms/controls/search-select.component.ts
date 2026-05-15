import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormFieldComponent } from '../wrappers/form-field.component';
import { BaseControlValueAccessor } from './base-control';
import { ERPFormOption } from '../models/form.models';

@Component({
  selector: 'erp-search-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MultiSelectModule, FormFieldComponent],
  template: `
    <app-erp-form-field 
      [label]="label" 
      [required]="required" 
      [helperText]="helperText" 
      [control]="ngControl">
      
      <p-multiSelect
        [(ngModel)]="value"
        (ngModelChange)="onModelChange($event)"
        (onBlur)="onTouched()"
        [options]="options"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [filter]="true"
        [display]="display"
        optionLabel="label"
        optionValue="value"
        styleClass="w-full"
        [ngClass]="{'p-invalid': ngControl?.invalid && ngControl?.touched}"
      ></p-multiSelect>

    </app-erp-form-field>
  `
})
export class SearchSelectComponent extends BaseControlValueAccessor<any[]> {
  @Input() options: ERPFormOption[] = [];
  @Input() display: 'comma' | 'chip' = 'chip';
}
