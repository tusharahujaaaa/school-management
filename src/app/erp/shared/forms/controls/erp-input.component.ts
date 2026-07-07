import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { BaseControlValueAccessor } from '../utils/base-control';

@Component({
  selector: 'app-erp-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, InputNumberModule],
  template: `
    <div class="erp-input-wrapper">
      <input 
        pInputText 
        [id]="id"
        [type]="type" 
        [placeholder]="placeholder"
        [disabled]="disabled"
        [value]="value"
        [attr.maxlength]="maxlength"
        (input)="onRawInput($event)"
        (blur)="onTouched()"
        class="w-full"
        [ngClass]="{'ng-invalid ng-dirty': controlDir?.invalid && controlDir?.touched}"
      />
    </div>
  `
})
export class ErpInputComponent extends BaseControlValueAccessor<string | number> {
  @Input() type: 'text' | 'password' | 'email' | 'number' = 'text';
  @Input() maxlength?: number | string;
  @Input() numericOnly = false;

  onRawInput(event: Event): void {
    let val = (event.target as HTMLInputElement).value;
    if (this.numericOnly) {
      val = val.replace(/[^0-9]/g, '');
      (event.target as HTMLInputElement).value = val;
    }
    this.handleInputChange(this.type === 'number' ? Number(val) : val);
  }
}
