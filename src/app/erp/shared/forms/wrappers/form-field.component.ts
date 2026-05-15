import { Component, Input, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl } from '@angular/forms';
import { ERP_VALIDATION_MESSAGES } from '../constants/validation-messages.constant';

@Component({
  selector: 'app-erp-form-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="erp-form-field mb-3">
      <div class="flex align-items-center justify-content-between mb-2">
        <label *ngIf="label" [for]="id" class="block text-900 font-medium">
          {{ label }}
          <span *ngIf="required" class="text-red-500">*</span>
        </label>
        <i *ngIf="control?.status === 'PENDING'" class="pi pi-spin pi-spinner text-blue-500 text-sm"></i>
      </div>
      
      <div class="field-container">
        <ng-content></ng-content>
      </div>

      <small *ngIf="helperText && !errorMessage" class="text-500 mt-1 block">
        {{ helperText }}
      </small>

      <div class="error-container min-h-1rem mt-1">
        <small *ngIf="errorMessage" class="p-error block text-xs animate-fade-in">
          {{ errorMessage }}
        </small>
      </div>
    </div>
  `,
  styles: [`
    .erp-form-field { width: 100%; }
    .min-h-1rem { min-height: 1.25rem; }
  `]
})
export class FormFieldComponent {
  @Input() id?: string;
  @Input() label?: string;
  @Input() required = false;
  @Input() helperText?: string;
  
  /**
   * We can pass the control to the field to automatically show errors,
   * or rely on the control inside the ng-content.
   */
  @Input() control?: NgControl;

  get errorMessage(): string | null {
    if (!this.control || !this.control.errors || !this.control.touched) {
      return null;
    }

    const firstErrorKey = Object.keys(this.control.errors)[0];
    const errorFn = ERP_VALIDATION_MESSAGES[firstErrorKey];
    
    return errorFn ? errorFn(this.control.errors[firstErrorKey]) : 'Invalid input';
  }
}
