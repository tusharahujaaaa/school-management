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

  onRawInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.handleInputChange(this.type === 'number' ? Number(val) : val);
  }
}
