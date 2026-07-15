import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TransportStore } from '../../store/transport.store';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TableModule } from 'primeng/table';

import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '@/app/erp/shared/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-bus-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ToggleButtonModule,
    TableModule,
    ConfirmDialogComponent
  ],
  providers: [MessageService],
  templateUrl: './bus-list.component.html'
})
export class BusListComponent implements OnInit {
  protected transportStore = inject(TransportStore);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private router = inject(Router);

  busDialog = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  selectedBusId = signal<string | null>(null);
  confirmDeleteVisible = signal<boolean>(false);
  busToDelete = signal<any | null>(null);
  deleteConfirmationMessage = computed(() => {
    const bus = this.busToDelete();
    return bus ? `Are you sure you want to delete bus route ${bus.routeName} (${bus.plateNumber})?` : '';
  });
  busForm!: FormGroup;

  ngOnInit() {
    this.initForm();
    this.transportStore.loadBuses();
  }

  initForm() {
    this.busForm = this.fb.group({
      routeName: ['', [Validators.required, Validators.minLength(3)]],
      driverName: [''],
      driverPhone: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      conductorName: [''],
      plateNumber: ['', [Validators.required]],
      capacity: [null, [Validators.min(1)]],
      startDestination: [''],
      endDestination: [''],
      isActive: [true, Validators.required]
    });
  }

  openAddModal() {
    this.isEditMode.set(false);
    this.selectedBusId.set(null);
    this.busForm.reset({
      routeName: '',
      driverName: '',
      driverPhone: '',
      conductorName: '',
      plateNumber: '',
      capacity: null,
      startDestination: '',
      endDestination: '',
      isActive: true
    });
    this.busDialog.set(true);
  }

  openEditModal(bus: any) {
    this.isEditMode.set(true);
    this.selectedBusId.set(bus.id);
    this.busForm.reset({
      routeName: bus.routeName,
      driverName: bus.driverName || '',
      driverPhone: bus.driverPhone || '',
      conductorName: bus.conductorName || '',
      plateNumber: bus.plateNumber || '',
      capacity: bus.capacity,
      startDestination: bus.startDestination || '',
      endDestination: bus.endDestination || '',
      isActive: bus.isActive
    });
    this.busDialog.set(true);
  }

  saveBus() {
    if (this.busForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields correctly.'
      });
      return;
    }

    const payload = this.busForm.value;

    if (this.isEditMode() && this.selectedBusId()) {
      this.transportStore.updateBus(this.selectedBusId()!, payload).subscribe({
        next: (res) => {
          if (res?.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Bus route updated successfully.'
            });
            this.busDialog.set(false);
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Update Failed',
            detail: err?.error?.message || 'Unable to update bus.'
          });
        }
      });
    } else {
      this.transportStore.createBus(payload).subscribe({
        next: (res) => {
          if (res?.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Bus route registered successfully.'
            });
            this.busDialog.set(false);
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Registration Failed',
            detail: err?.error?.message || 'Unable to register bus.'
          });
        }
      });
    }
  }

  deleteBus(bus: any) {
    this.busToDelete.set(bus);
    this.confirmDeleteVisible.set(true);
  }

  onConfirmDeleteBus() {
    const bus = this.busToDelete();
    if (!bus) return;

    this.transportStore.deleteBus(bus.id).subscribe({
      next: (res) => {
        if (res?.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Bus route deleted successfully.'
          });
        }
        this.busToDelete.set(null);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Deletion Failed',
          detail: err?.error?.message || 'Unable to delete bus.'
        });
        this.busToDelete.set(null);
      }
    });
  }

  selectBusRow(busId: string) {
    this.router.navigate(['/erp/transport/buses', busId]);
  }
}
