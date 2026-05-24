import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentStore } from '../../store/student.store';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { StudentFormComponent } from '../../components/forms/student-form.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-create-edit',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, StudentFormComponent, ToastModule],
  providers: [MessageService],
  templateUrl: './student-create-edit.component.html'
})
export class StudentCreateEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected store = inject(StudentStore);
  private studentService = inject(StudentService);
  private messageService = inject(MessageService);

  isEditMode = signal(false);
  isLoading = signal(false);
  studentId = signal<string | null>(null);

  pageTitle = computed(() => this.isEditMode() ? 'Edit Student' : 'Add New Student');
  
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const isEdit = this.route.snapshot.url.some(segment => segment.path === 'edit');
    
    if (id && isEdit) {
      this.isEditMode.set(true);
      this.studentId.set(id);
      this.loadStudent(id);
    }
  }

  loadStudent(id: string) {
    this.isLoading.set(true);
    this.studentService.getStudentById(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (student) => {
          if (student) {
            this.store.selectStudent(id);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Student not found' });
            this.router.navigate(['/erp/students']);
          }
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load student' });
        }
      });
  }

  onSave(studentData: any) {
    this.isLoading.set(true);

    const classId = this.store.getClassId(studentData.class, studentData.section);
    if (!classId) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Selected class and section combination is invalid.' 
      });
      this.isLoading.set(false);
      return;
    }

    const payload = {
      classId,
      name: studentData.firstName + ' ' + (studentData.middleName ? studentData.middleName + ' ' : '') + studentData.lastName,
      rollNumber: studentData.rollNumber,
      dateOfBirth: studentData.dateOfBirth,
      gender: studentData.gender.toUpperCase(),
      parentName: studentData.parentName || 'Parent',
      parentPhone: studentData.contactNumber,
      parentEmail: studentData.email || null,
      address: studentData.address || null,
      admissionDate: studentData.admissionDate || null,
      status: studentData.status.toUpperCase(),
      photoUrl: studentData.photoUrl || null
    };

    const request = this.isEditMode() 
      ? this.studentService.updateStudent(this.studentId()!, payload)
      : this.studentService.createStudent(payload);

    request.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: `Student ${this.isEditMode() ? 'updated' : 'created'} successfully!` 
        });
        
        setTimeout(() => {
          this.router.navigate(['/erp/students']);
        }, 1000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: err?.error?.message || 'Failed to save student record.' 
        });
      }
    });
  }

  onCancel() {
    this.router.navigate(['/erp/students']);
  }
}
