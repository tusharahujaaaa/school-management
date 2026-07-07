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
import { ClassesService } from '@/app/erp/domains/academics/services/classes.service';

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
  private classesService = inject(ClassesService);

  isEditMode = signal(false);
  isLoading = signal(false);
  studentId = signal<string | null>(null);

  pageTitle = computed(() => this.isEditMode() ? 'Edit Student' : 'Add New Student');
  
  ngOnInit() {
    this.classesService.loadSessions();
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

    // Resolve academic session ID from list or fallback to active session
    const matchedSession = this.classesService.sessions().find(s => s.name === studentData.academicSession);
    const sessionId = matchedSession?.id || this.classesService.activeSession()?.id;

    if (!sessionId && !this.isEditMode()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Session Missing',
        detail: 'Unable to resolve academic session ID.'
      });
      this.isLoading.set(false);
      return;
    }

    let payload: any;
    if (this.isEditMode()) {
      // Backend updateStudent expects flat payload mapping database columns directly
      payload = {
        classId,
        name: studentData.firstName + ' ' + (studentData.middleName ? studentData.middleName + ' ' : '') + studentData.lastName,
        admissionNumber: studentData.admissionNumber || null,
        rollNumber: studentData.rollNumber || null,
        dateOfBirth: studentData.dateOfBirth,
        gender: studentData.gender.toUpperCase(),
        parentName: studentData.parentName || 'Parent',
        parentPhone: studentData.contactNumber,
        parentEmail: studentData.email || null,
        address: studentData.address || null,
        city: studentData.city || null,
        state: studentData.state || null,
        pincode: studentData.postalCode || null,
        admissionDate: studentData.admissionDate || null,
        status: studentData.status.toUpperCase(),
        photoUrl: studentData.photoUrl || null,
        emergencyContact: studentData.emergencyContact || null,
        emergencyPhone: studentData.emergencyContact || null
      };
    } else {
      // Backend createStudent expects nested structure (personalInfo, parentInfo, etc.)
      payload = {
        personalInfo: {
          name: studentData.firstName + ' ' + (studentData.middleName ? studentData.middleName + ' ' : '') + studentData.lastName,
          dateOfBirth: studentData.dateOfBirth,
          gender: studentData.gender.toUpperCase(),
          photoUrl: studentData.photoUrl || null
        },
        parentInfo: {
          fatherName: studentData.parentName || 'Parent',
          fatherPhone: studentData.contactNumber,
          fatherEmail: studentData.email || null,
          address: studentData.address || null,
          city: studentData.city || null,
          state: studentData.state || null,
          pincode: studentData.postalCode || null,
          emergencyContact: studentData.emergencyContact || null,
          emergencyPhone: studentData.emergencyContact || null
        },
        academicInfo: {
          classId,
          sessionId,
          admissionDate: studentData.admissionDate || null,
          admissionNumber: studentData.admissionNumber || null,
          rollNumber: studentData.rollNumber || null
        },
        services: {
          usesTransport: studentData.usesTransport || false,
          busId: studentData.usesTransport ? studentData.busId : null,
          pickupPoint: studentData.usesTransport ? studentData.pickupPoint : '',
          dropPoint: studentData.usesTransport ? studentData.dropPoint : ''
        }
      };
    }

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
