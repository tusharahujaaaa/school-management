import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClassesService } from '../../services/classes.service';
import { TeachersHttpService } from '../../../teachers/services/teachers-http.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-class-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TabsModule
  ],
  providers: [MessageService],
  templateUrl: './class-list.component.html'
})
export class ClassListComponent implements OnInit {
  protected classesService = inject(ClassesService);
  private teachersHttpSvc = inject(TeachersHttpService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  classDialog = signal<boolean>(false);
  classDetailDialog = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  selectedClassId = signal<string | null>(null);
  
  classForm!: FormGroup;
  teachersList = signal<any[]>([]);

  ngOnInit() {
    this.initForm();
    this.classesService.loadClasses();
    this.loadTeachersDropdown();
  }

  initForm() {
    this.classForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      section: ['', [Validators.required, Validators.maxLength(5)]],
      classTeacherId: [null]
    });
  }

  loadTeachersDropdown() {
    this.teachersHttpSvc.getTeachers().subscribe({
      next: (res: any) => {
        if (res?.success && Array.isArray(res.data)) {
          const mapped = res.data.map((t: any) => ({
            label: `${t.name} (${t.subject || 'General'})`,
            value: t.id
          }));
          this.teachersList.set(mapped);
        }
      },
      error: (err) => console.error('Error loading teachers for dropdown:', err)
    });
  }

  openAddModal() {
    this.isEditMode.set(false);
    this.selectedClassId.set(null);
    this.classForm.reset({
      name: '',
      section: '',
      classTeacherId: null
    });
    this.classDialog.set(true);
  }

  openEditModal(cls: any, event: Event) {
    event.stopPropagation(); // Avoid triggering card details click
    this.isEditMode.set(true);
    this.selectedClassId.set(cls.id);
    this.classForm.reset({
      name: cls.name,
      section: cls.section,
      classTeacherId: cls.classTeacherId || null
    });
    this.classDialog.set(true);
  }

  viewClassDetails(clsId: string) {
    this.selectedClassId.set(clsId);
    this.classesService.loadClassDetail(clsId);
    this.classDetailDialog.set(true);
  }

  getTeacherName(teacherId: string | null): string {
    if (!teacherId) return 'No Class Teacher';
    const match = this.teachersList().find(t => t.value === teacherId);
    return match ? match.label.split(' (')[0] : 'Assigned Teacher';
  }

  saveClass() {
    if (this.classForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please enter class name and section.'
      });
      return;
    }

    const formVal = this.classForm.value;
    const payload = {
      name: formVal.name,
      section: formVal.section,
      classTeacherId: formVal.classTeacherId || null
    };

    if (this.isEditMode() && this.selectedClassId()) {
      this.classesService.updateClass(this.selectedClassId()!, payload).subscribe({
        next: (res: any) => {
          if (res?.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Class Updated',
              detail: `${formVal.name} - ${formVal.section} updated successfully.`
            });
            this.classDialog.set(false);
            this.classesService.loadClasses();
          }
        },
        error: (err: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Update Failed',
            detail: err?.error?.message || 'Unable to update class.'
          });
        }
      });
    } else {
      this.classesService.createClass(payload).subscribe({
        next: (res: any) => {
          if (res?.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Class Created',
              detail: `${formVal.name} - ${formVal.section} created successfully.`
            });
            this.classDialog.set(false);
            this.classesService.loadClasses();
          }
        },
        error: (err: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Creation Failed',
            detail: err?.error?.message || 'Unable to create class.'
          });
        }
      });
    }
  }

  deleteClass(cls: any, event: Event) {
    event.stopPropagation(); // Avoid triggering card click
    
    // Check student count first
    if (cls._count?.students > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cannot Delete Class',
        detail: `Class has ${cls._count.students} active students. Reassign or remove students before deleting.`
      });
      return;
    }

    if (confirm(`Are you sure you want to delete class ${cls.name} - ${cls.section}?`)) {
      this.classesService.deleteClass(cls.id).subscribe({
        next: (res: any) => {
          if (res?.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Class Deleted',
              detail: `Class deleted successfully.`
            });
            this.classesService.loadClasses();
          }
        },
        error: (err: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Deletion Failed',
            detail: err?.error?.message || 'Unable to delete class.'
          });
        }
      });
    }
  }
}
