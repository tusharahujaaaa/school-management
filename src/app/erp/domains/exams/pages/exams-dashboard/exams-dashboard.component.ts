import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ExamStore } from '../../store/exam.store';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ERP_PERMISSIONS } from '../../../../core/permissions/constants/permission.constants';
import { StudentStore } from '../../../students/store/student.store';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { AuthService } from '../../../auth/services/auth.service';
import { ClassesService } from '../../../academics/services/classes.service';

@Component({
  selector: 'app-exams-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderComponent,
    ButtonModule,
    TooltipModule,
    SelectModule,
    DialogModule,
    ToastModule,
    CardModule,
    TableModule,
    RouterModule
  ],
  providers: [MessageService],
  templateUrl: './exams-dashboard.component.html'
})
export class ExamsDashboardComponent implements OnInit {
  protected store = inject(ExamStore);
  protected studentStore = inject(StudentStore);
  protected authService = inject(AuthService);
  protected classService = inject(ClassesService); 
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  readonly PERMISSIONS = ERP_PERMISSIONS;

  // Session configuration scoping
  activeSessionId = computed(() => this.authService.activeSessionId());
  activeSession = computed(() => this.authService.activeSession());
  // Dialog visibility states
  examDialogVisible = signal<boolean>(false);
  subjectDialogVisible = signal<boolean>(false);
  
  examForm!: FormGroup;
  subjectForm!: FormGroup;
  selectedExam = signal<any | null>(null);

  ngOnInit() {
    this.store.loadExams(this.activeSessionId());
    this.initForms();
  }

  initForms() {
    this.examForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      examTypeId: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      gradingSchemeId: [null]
    });

    this.subjectForm = this.fb.group({
      classId: ['', Validators.required],
      subjectId: ['', Validators.required],
      maxMarks: [100, [Validators.required, Validators.min(1)]],
      passingMarks: [33, [Validators.required, Validators.min(0)]],
      examDate: [null],
      startTime: [''],
      endTime: ['']
    });
  }

  get examTypesOptions() {
    return this.store.examTypes().map(t => ({ label: t.name, value: t.id }));
  }

  get gradeSchemeOptions() {
    return this.store.gradeSchemes().map(s => ({ label: s.name, value: s.id }));
  }

  get classOptions() {
    // Dynamically retrieve classes list from student store setup caching
    return this.studentStore.classes().map(c => {
      // Map class names or find details
      return { label: c, value: c }; // simple mock string matching backend database class scopes
    });
  }

  // Temporary list mock mappings
  classesList = computed(()=> {return this.classService.classes().map(c => ({ label: c.name, value: c.id }))});
  
  subjectsList = computed(() => {
    return this.classService.activeClassDetail()?.subjects?.map((s: any) => ({ label: s.name, value: s.id })) || [];
  })
  //   signal<any[]>([
  //   { label: 'Mathematics', value: 'maths-uuid-mock' },
  //   { label: 'English', value: 'english-uuid-mock' },
  //   { label: 'Science', value: 'science-uuid-mock' }
  // ]);

  openCreateExam() {
    this.examForm.reset();
    this.examDialogVisible.set(true);
  }

  saveExam() {
    if (this.examForm.invalid) {
      this.examForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.examForm.value,
      academicSessionId: this.activeSessionId()
    };

    this.store.createExam(payload, this.activeSessionId(), () => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Exam created successfully' });
      this.examDialogVisible.set(false);
    });
  }

  getSubjects() {
    this.classService.loadClassDetail(this.subjectForm.value.classId);
  }
  openAddSubject(exam: any) {
    this.classService.loadClasses(); // Load classes for selection
    this.selectedExam.set(exam);
    this.subjectForm.reset({ maxMarks: 100, passingMarks: 33 });
    this.subjectDialogVisible.set(true);
  }

  saveSubject() {
    if (this.subjectForm.invalid) {
      this.subjectForm.markAllAsTouched();
      return;
    }

    this.store.addSubjectToExam(this.selectedExam().id, this.subjectForm.value, this.activeSessionId(), () => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Subject added to exam' });
      this.subjectDialogVisible.set(false);
    });
  }

  publishExam(exam: any) {
    this.store.publishAndRank(exam.id, this.activeSessionId(), () => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Results published successfully' });
    });
  }

  navigateToMarksEntry(examSubjectId: string) {
    this.router.navigate(['/erp/exams/subjects', examSubjectId, 'marks']);
  }
}
