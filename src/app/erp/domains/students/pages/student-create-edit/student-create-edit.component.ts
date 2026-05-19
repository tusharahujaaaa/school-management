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
    // Simulate save API with mock delay
    setTimeout(() => {
      this.isLoading.set(false);
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Success', 
        detail: `Student ${this.isEditMode() ? 'updated' : 'created'} successfully!` 
      });
      
      // Navigate back after success feedback
      setTimeout(() => {
        this.router.navigate(['/erp/students']);
      }, 1000);
    }, 1500);
  }

  onCancel() {
    this.router.navigate(['/erp/students']);
  }
}
