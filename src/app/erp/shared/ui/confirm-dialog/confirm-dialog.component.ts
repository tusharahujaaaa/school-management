import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  template: `
    <p-dialog 
      [header]="header" 
      [(visible)]="visible" 
      [modal]="true" 
      [style]="{ width: '450px' }" 
      [draggable]="false" 
      [resizable]="false" 
      [closable]="closable"
      (onHide)="onHide()"
      styleClass="p-fluid border-round-xl shadow-4 overflow-hidden">
      
      <div class="flex align-items-start gap-3 p-2 pt-3">
        <div class="flex align-items-center justify-content-center border-circle p-2" [class]="'bg-' + severity + '-50'" style="width: 3rem; height: 3rem;">
          <i [class]="icon + ' text-xl text-' + severity + '-600'"></i>
        </div>
        <div class="flex-1">
          <div class="text-900 text-sm font-medium line-height-3">
            {{ message }}
          </div>
          <div *ngIf="subMessage" class="text-500 text-xs mt-1.5 line-height-3">
            {{ subMessage }}
          </div>
        </div>
      </div>

      <div class="flex justify-content-end gap-2 mt-4 pt-2 border-top-1 surface-border">
        <button pButton type="button" [label]="rejectLabel" class="p-button-text p-button-sm w-auto px-4" (click)="onReject()"></button>
        <button pButton type="button" [label]="acceptLabel" [class]="'p-button-sm w-auto px-4 ' + acceptButtonClass" (click)="onAccept()"></button>
      </div>
    </p-dialog>
  `
})
export class ConfirmDialogComponent {
  @Input() header: string = 'Confirmation Required';
  @Input() message: string = 'Are you sure you want to proceed?';
  @Input() subMessage: string = '';
  @Input() icon: string = 'pi pi-exclamation-triangle';
  @Input() severity: 'warn' | 'danger' | 'info' | 'success' = 'warn';
  @Input() acceptLabel: string = 'Confirm';
  @Input() rejectLabel: string = 'Cancel';
  @Input() acceptButtonClass: string = 'p-button-primary';
  @Input() closable: boolean = true;

  @Input() set show(val: boolean) {
    this.visible = val;
  }
  
  @Output() showChange = new EventEmitter<boolean>();
  @Output() accept = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();

  visible: boolean = false;

  onAccept() {
    this.visible = false;
    this.showChange.emit(false);
    this.accept.emit();
  }

  onReject() {
    this.visible = false;
    this.showChange.emit(false);
    this.reject.emit();
  }

  onHide() {
    this.showChange.emit(false);
    this.reject.emit();
  }
}
