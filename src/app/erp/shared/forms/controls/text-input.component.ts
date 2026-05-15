import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormFieldComponent } from '../wrappers/form-field.component';
import { BaseControlValueAccessor } from './base-control';

@Component({
  selector: 'erp-text-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, PasswordModule, FormFieldComponent],
  template: `
    <app-erp-form-field 
      [label]="label" 
      [required]="required" 
      [helperText]="helperText" 
      [control]="ngControl">
      
      <span [class.p-input-icon-right]="loading">
        <i *ngIf="loading" class="pi pi-spin pi-spinner"></i>
        
        <ng-container [ngSwitch]="type">
          <!-- Password Type -->
          <p-password 
            *ngSwitchCase="'password'"
            [(ngModel)]="value"
            (ngModelChange)="onModelChange($event)"
            (onBlur)="onTouched()"
            [placeholder]="placeholder"
            [disabled]="disabled"
            [toggleMask]="true"
            [feedback]="showPasswordFeedback"
            styleClass="w-full"
            inputStyleClass="w-full"
          ></p-password>

          <!-- Default Text Type -->
          <input 
            *ngSwitchDefault
            pInputText
            [type]="type"
            [(ngModel)]="value"
            (ngModelChange)="onModelChange($event)"
            (blur)="onTouched()"
            [placeholder]="placeholder"
            [disabled]="disabled"
            class="w-full"
            [ngClass]="{'p-invalid': ngControl?.invalid && ngControl?.touched}"
          />
        </ng-container>
      </span>

    </app-erp-form-field>
  `,
  styles: [`
    :host ::ng-deep .p-password input { width: 100%; }
  `]
})
export class TextInputComponent extends BaseControlValueAccessor<string> {
  @Input() type: 'text' | 'password' | 'email' | 'number' = 'text';
  @Input() showPasswordFeedback = false;
}
