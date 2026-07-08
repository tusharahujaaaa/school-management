import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClassesService } from '../../services/classes.service';
import { TeachersHttpService } from '../../../teachers/services/teachers-http.service';
import { SubjectsHttpService } from '../../services/subjects-http.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { ConfirmDialogComponent } from '@/app/erp/shared/ui/confirm-dialog/confirm-dialog.component';

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
    TabsModule,
    ConfirmDialogComponent
  ],
  providers: [MessageService],
  templateUrl: './class-list.component.html'
})
export class ClassListComponent implements OnInit {
  protected classesService = inject(ClassesService);
  private teachersHttpSvc = inject(TeachersHttpService);
  private subjectsHttpSvc = inject(SubjectsHttpService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  classDialog = signal<boolean>(false);
  classDetailDialog = signal<boolean>(false);
  sessionDialog = signal<boolean>(false);
  subjectDialog = signal<boolean>(false);
  confirmSessionVisible = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  selectedClassId = signal<string | null>(null);
  selectedClassForSubject = signal<string | null>(null);
  selectedSessionToActivate = signal<{ id: string; name: string } | null>(null);
  confirmationMessage = computed(() => {
    const session = this.selectedSessionToActivate();
    return session ? `Are you sure you want to set Academic Session "${session.name}" as active?` : '';
  });
  
  classForm!: FormGroup;
  sessionForm!: FormGroup;
  subjectForm!: FormGroup;
  teachersList = signal<any[]>([]);

  ngOnInit() {
    this.initForm();
    this.initSessionForm();
    this.initSubjectForm();
    this.classesService.loadClasses();
    this.classesService.loadSessions();
    this.loadTeachersDropdown();
  }

  initForm() {
    this.classForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      section: ['', [Validators.required, Validators.maxLength(5)]],
      classTeacherId: [null]
    });
  }

  initSessionForm() {
    this.sessionForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}$/)]], // e.g. "2026-27"
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      isActive: [false]
    });
  }

  initSubjectForm() {
    this.subjectForm = this.fb.group({
      name: ['', [Validators.required]],
      teacherId: [null]
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

  // ─── Academic Sessions Actions ─────────────────────
  openSessionModal() {
    this.sessionForm.reset({
      name: '',
      startDate: '',
      endDate: '',
      isActive: false
    });
    this.sessionDialog.set(true);
  }

  saveSession() {
    if (this.sessionForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please check your inputs. Name format must be YYYY-YY (e.g., 2026-27).'
      });
      return;
    }

    const formVal = this.sessionForm.value;
    
    // Validate that End Date is after Start Date
    const start = new Date(formVal.startDate);
    const end = new Date(formVal.endDate);
    if (end <= start) {
      this.messageService.add({
        severity: 'error',
        summary: 'Date Error',
        detail: 'End Date must be after Start Date.'
      });
      return;
    }

    const payload = {
      name: formVal.name,
      startDate: new Date(formVal.startDate).toISOString(),
      endDate: new Date(formVal.endDate).toISOString(),
      isActive: formVal.isActive || false
    };

    this.classesService.createSession(payload).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Session Created',
            detail: `Academic session '${formVal.name}' created successfully.`
          });
          this.sessionDialog.set(false);
          this.classesService.loadSessions();
        }
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Creation Failed',
          detail: err?.error?.message || 'Unable to create academic session.'
        });
      }
    });
  }

  activateSession(sessionId: string, sessionName: string) {
    this.selectedSessionToActivate.set({ id: sessionId, name: sessionName });
    this.confirmSessionVisible.set(true);
  }

  onConfirmSessionActivation() {
    const session = this.selectedSessionToActivate();
    if (!session) return;

    this.classesService.activateSession(session.id).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Session Activated',
            detail: `Academic session '${session.name}' is now active. All other sessions have been archived.`
          });
          this.classesService.loadSessions();
        }
        this.selectedSessionToActivate.set(null);
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Activation Failed',
          detail: err?.error?.message || 'Unable to activate session.'
        });
        this.selectedSessionToActivate.set(null);
      }
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  openAddSubjectModal(classId: string) {
    this.selectedClassForSubject.set(classId);
    this.subjectForm.reset({
      name: '',
      teacherId: null
    });
    this.subjectDialog.set(true);
  }

  saveSubject() {
    if (this.subjectForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Subject name is required.'
      });
      return;
    }

    const formVal = this.subjectForm.value;
    const payload = {
      name: formVal.name,
      classId: this.selectedClassForSubject()!,
      teacherId: formVal.teacherId || null
    };

    this.subjectsHttpSvc.createSubject(payload).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Subject Added',
            detail: `Subject '${formVal.name}' mapped successfully.`
          });
          this.subjectDialog.set(false);
          // Refresh details dialog data
          this.classesService.loadClassDetail(this.selectedClassForSubject()!);
        }
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed to Add Subject',
          detail: err?.error?.message || 'Unable to map subject.'
        });
      }
    });
  }

  deleteSubject(subjectId: string) {
    if (confirm('Are you sure you want to delete this subject mapping?')) {
      this.subjectsHttpSvc.deleteSubject(subjectId).subscribe({
        next: (res: any) => {
          if (res?.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Subject Removed',
              detail: 'Subject unmapped successfully.'
            });
            // Refresh details dialog data
            const classId = this.classesService.activeClassDetail()?.id;
            if (classId) {
              this.classesService.loadClassDetail(classId);
            }
          }
        },
        error: (err: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Removal Failed',
            detail: err?.error?.message || 'Unable to unmap subject.'
          });
        }
      });
    }
  }
}
