import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { FormFieldComponent } from '../wrappers/form-field.component';
import { BaseControlValueAccessor } from './base-control';

@Component({
  selector: 'erp-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TextareaModule, FormFieldComponent],
  template: `
    <app-erp-form-field 
      [label]="label" 
      [required]="required" 
      [helperText]="helperText" 
      [control]="ngControl">
      
      <textarea
        pTextarea
        [(ngModel)]="value"
        (ngModelChange)="onModelChange($event)"
        (blur)="onTouched()"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [rows]="rows"
        [autoResize]="autoResize"
        class="w-full"
        [ngClass]="{'p-invalid': ngControl?.invalid && ngControl?.touched}"
      ></textarea>

    </app-erp-form-field>
  `
})
export class TextAreaComponent extends BaseControlValueAccessor<string> {
  @Input() rows = 3;
  @Input() autoResize = true;
}
