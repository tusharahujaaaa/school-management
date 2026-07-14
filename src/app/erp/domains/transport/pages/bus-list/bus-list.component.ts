import { Component, inject, OnInit, signal } from '@angular/core';
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
    TableModule
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
    if (confirm(`Are you sure you want to delete bus route ${bus.routeName} (${bus.plateNumber})?`)) {
      this.transportStore.deleteBus(bus.id).subscribe({
        next: (res) => {
          if (res?.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Bus route deleted successfully.'
            });
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Deletion Failed',
            detail: err?.error?.message || 'Unable to delete bus.'
          });
        }
      });
    }
  }

  selectBusRow(busId: string) {
    this.router.navigate(['/erp/transport/buses', busId]);
  }
}
