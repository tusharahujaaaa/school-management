import { Component, inject, OnInit, signal, computed, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TeachersService } from '../../services/teachers.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule
  ],
  providers: [MessageService],
  templateUrl: './teacher-list.component.html'
})
export class TeacherListComponent implements OnInit {
  protected teachersService = inject(TeachersService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  teacherDialog = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  selectedTeacherId = signal<string | null>(null);
  teacherForm!: FormGroup;

  searchQuery = signal<string>('');

  activeTeachersCount = computed(() => this.teachersService.teachers().filter(t => t.isActive).length);
  inactiveTeachersCount = computed(() => this.teachersService.teachers().filter(t => !t.isActive).length);

  statusOptions = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
  ];

  ngOnInit() {
    this.initForm();
    this.teachersService.loadTeachers();
  }

  initForm() {
    this.teacherForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.pattern(/^[+]?[0-9\s-]{10,15}$/)]],
      subject: [''],
      joiningDate: [null],
      photoUrl: [''],
      isActive: [true, Validators.required]
    });
  }

  onSearch(event: any) {
    const val = event?.target?.value || '';
    this.searchQuery.set(val);
    this.teachersService.searchQuery.set(val);
    this.teachersService.loadTeachers();
  }

  openAddModal() {
    this.isEditMode.set(false);
    this.selectedTeacherId.set(null);
    this.teacherForm.reset({
      name: '',
      email: '',
      phone: '',
      subject: '',
      joiningDate: null,
      photoUrl: '',
      isActive: true
    });
    this.teacherDialog.set(true);
  }

  openEditModal(teacher: any) {
    this.isEditMode.set(true);
    this.selectedTeacherId.set(teacher.id);
    
    let formattedDate = null;
    if (teacher.joiningDate) {
      formattedDate = teacher.joiningDate.split('T')[0]; // format YYYY-MM-DD
    }

    this.teacherForm.reset({
      name: teacher.name,
      email: teacher.email || '',
      phone: teacher.phone || '',
      subject: teacher.subject || '',
      joiningDate: formattedDate,
      photoUrl: teacher.photoUrl || '',
      isActive: teacher.isActive
    });
    this.teacherDialog.set(true);
  }

  saveTeacher() {
    if (this.teacherForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields correctly.'
      });
      return;
    }

    const formVal = this.teacherForm.value;
    const payload: any = {
      ...formVal,
      email: formVal.email || null,
      phone: formVal.phone || null,
      subject: formVal.subject || null,
      photoUrl: formVal.photoUrl || null
    };

    if (formVal.joiningDate) {
      payload.joiningDate = new Date(formVal.joiningDate).toISOString();
    }

    if (this.isEditMode() && this.selectedTeacherId()) {
      this.teachersService.updateTeacher(this.selectedTeacherId()!, payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res: any) => {
          if (res?.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Teacher Updated',
              detail: `${formVal.name} updated successfully.`
            });
            this.teacherDialog.set(false);
            this.teachersService.loadTeachers();
          }
        },
        error: (err: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Update Failed',
            detail: err?.error?.message || 'Unable to update teacher.'
          });
        }
      });
    } else {
      this.teachersService.createTeacher(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res: any) => {
          if (res?.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Teacher Created',
              detail: `${formVal.name} created successfully.`
            });

            if (res.data?.teacherAccount?.isDummy) {
              this.messageService.add({
                severity: 'info',
                summary: 'Credentials Generated',
                detail: `Dummy Email: ${res.data.teacherAccount.email}`,
                life: 10000
              });
            }

            this.teacherDialog.set(false);
            this.teachersService.loadTeachers();
          }
        },
        error: (err: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Creation Failed',
            detail: err?.error?.message || 'Unable to create teacher.'
          });
        }
      });
    }
  }

  deleteTeacher(teacher: any) {
    if (confirm(`Are you sure you want to delete teacher ${teacher.name}?`)) {
      this.teachersService.deleteTeacher(teacher.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res: any) => {
          if (res?.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Teacher Deleted',
              detail: `${teacher.name} deleted successfully.`
            });
            this.teachersService.loadTeachers();
          }
        },
        error: (err: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Deletion Failed',
            detail: err?.error?.message || 'Unable to delete teacher.'
          });
        }
      });
    }
  }
}
