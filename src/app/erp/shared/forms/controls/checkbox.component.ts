import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { BaseControlValueAccessor } from './base-control';

@Component({
  selector: 'erp-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CheckboxModule],
  template: `
    <div class="erp-checkbox-field mb-3">
      <div class="flex align-items-center">
        <p-checkbox
          [(ngModel)]="value"
          (ngModelChange)="onModelChange($event)"
          (onBlur)="onTouched()"
          [binary]="true"
          [label]="label || ''"
          [disabled]="disabled"
          [inputId]="label || ''"
        ></p-checkbox>
      </div>
      <small *ngIf="helperText" class="text-500 mt-1 block ml-4">
        {{ helperText }}
      </small>
      <div class="error-container min-h-1rem mt-1 ml-4">
        <small *ngIf="ngControl?.invalid && ngControl?.touched" class="p-error block text-xs">
          {{ errorMessage }}
        </small>
      </div>
    </div>
  `,
  styles: [`
    .min-h-1rem { min-height: 1.25rem; }
  `]
})
export class CheckboxComponent extends BaseControlValueAccessor<boolean> {
  // Checkbox often needs specialized error handling or simple label placement
  get errorMessage(): string | null {
    if (!this.ngControl || !this.ngControl.errors) return null;
    return 'This field is required'; // Usually checkboxes are just required or not
  }
}
