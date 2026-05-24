import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { FormFieldComponent } from '../wrappers/form-field.component';
import { BaseControlValueAccessor } from './base-control';

@Component({
  selector: 'erp-file-upload',
  standalone: true,
  imports: [CommonModule, FileUploadModule, FormFieldComponent],
  template: `
    <app-erp-form-field 
      [label]="label" 
      [required]="required" 
      [helperText]="helperText" 
      [control]="ngControl">
      
      <p-fileUpload
        mode="basic"
        [name]="name"
        [chooseLabel]="chooseLabel"
        [accept]="accept"
        [maxFileSize]="maxFileSize"
        (onSelect)="onFileSelect($event)"
        [disabled]="disabled"
        [auto]="true"
        class="w-full"
      ></p-fileUpload>

      <div *ngIf="value" class="mt-2 p-2 border-1 border-round border-300 flex align-items-center justify-content-between">
        <span class="text-sm truncate max-w-15rem">{{ value.name }}</span>
        <button pButton icon="pi pi-times" class="p-button-text p-button-rounded p-button-danger p-button-sm" (click)="clearFile()"></button>
      </div>

    </app-erp-form-field>
  `
})
export class FileUploadComponent extends BaseControlValueAccessor<File | null> {
  @Input() name = 'file';
  @Input() chooseLabel = 'Choose File';
  @Input() accept = 'image/*,application/pdf';
  @Input() maxFileSize = 1000000; // 1MB

  onFileSelect(event: any): void {
    const file = event.files[0];
    this.value = file;
    this.onModelChange(file);
    this.onTouched();
  }

  clearFile(): void {
    this.value = null;
    this.onModelChange(null);
  }
}
