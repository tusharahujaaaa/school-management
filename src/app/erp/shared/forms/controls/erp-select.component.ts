import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { BaseControlValueAccessor } from '../utils/base-control';

export interface ErpSelectOption {
  label: string;
  value: any;
  icon?: string;
}

@Component({
  selector: 'app-erp-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectModule],
  template: `
    <div class="erp-select-wrapper">
      <p-select
        [id]="id"
        [options]="options"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [ngModel]="value"
        (ngModelChange)="handleInputChange($event)"
        (onBlur)="onTouched()"
        styleClass="w-full"
        [appendTo]="'body'"
        [filter]="showFilter"
        [ngClass]="{'ng-invalid ng-dirty': controlDir?.invalid && controlDir?.touched}"
      >
        <ng-template pTemplate="selectedItem" let-selectedOption>
            <div class="flex align-items-center gap-2" *ngIf="selectedOption">
                <i *ngIf="selectedOption.icon" [class]="selectedOption.icon"></i>
                <div>{{ selectedOption.label }}</div>
            </div>
        </ng-template>
        <ng-template let-option pTemplate="item">
            <div class="flex align-items-center gap-2">
                <i *ngIf="option.icon" [class]="option.icon"></i>
                <div>{{ option.label }}</div>
            </div>
        </ng-template>
      </p-select>
    </div>
  `
})
export class ErpSelectComponent extends BaseControlValueAccessor<any> {
  @Input() options: ErpSelectOption[] = [];
  @Input() showFilter = false;
}
