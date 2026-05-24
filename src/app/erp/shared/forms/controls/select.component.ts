import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FormFieldComponent } from '../wrappers/form-field.component';
import { BaseControlValueAccessor } from './base-control';
import { ERPFormOption } from '../models/form.models';

@Component({
  selector: 'erp-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DropdownModule, FormFieldComponent],
  template: `
    <app-erp-form-field 
      [label]="label" 
      [required]="required" 
      [helperText]="helperText" 
      [control]="ngControl">
      
      <p-dropdown
        [(ngModel)]="value"
        (ngModelChange)="onModelChange($event)"
        (onBlur)="onTouched()"
        [options]="options"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [filter]="filter"
        [showClear]="showClear"
        optionLabel="label"
        optionValue="value"
        styleClass="w-full"
        [ngClass]="{'p-invalid': ngControl?.invalid && ngControl?.touched}"
      >
        <ng-template let-option pTemplate="item">
          <div class="flex align-items-center gap-2">
            <i *ngIf="option.icon" [class]="option.icon"></i>
            <span>{{ option.label }}</span>
          </div>
        </ng-template>
      </p-dropdown>

    </app-erp-form-field>
  `
})
export class SelectComponent extends BaseControlValueAccessor<any> {
  @Input() options: ERPFormOption[] = [];
  @Input() filter = false;
  @Input() showClear = true;
}
