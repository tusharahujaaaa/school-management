import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { BaseControlValueAccessor } from '../utils/base-control';

@Component({
  selector: 'app-erp-textarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextareaModule],
  template: `
    <div class="erp-textarea-wrapper">
      <textarea 
        pInputTextarea 
        [id]="id"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [value]="value"
        (input)="onRawInput($event)"
        (blur)="onTouched()"
        class="w-full"
        [rows]="rows"
        [autoResize]="autoResize"
        [ngClass]="{'ng-invalid ng-dirty': controlDir?.invalid && controlDir?.touched}"
      ></textarea>
    </div>
  `
})
export class ErpTextareaComponent extends BaseControlValueAccessor<string> {
  @Input() rows = 3;
  @Input() autoResize = true;

  onRawInput(event: Event): void {
    const val = (event.target as HTMLTextAreaElement).value;
    this.handleInputChange(val);
  }
}
