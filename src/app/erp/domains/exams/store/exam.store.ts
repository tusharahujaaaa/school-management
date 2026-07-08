import { Injectable, signal, computed, inject } from '@angular/core';
import { ExamService } from '../services/exam.service';
import { finalize, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ExamStore {
  private examService = inject(ExamService);

  // State
  private _exams = signal<any[]>([]);
  private _loading = signal<boolean>(false);
  
  private _gradeSchemes = signal<any[]>([]);
  private _workflowStages = signal<any[]>([]);
  private _resultStatuses = signal<any[]>([]);
  private _examTypes = signal<any[]>([]);

  // Selectors
  readonly exams = this._exams.asReadonly();
  readonly loading = this._loading.asReadonly();
  
  readonly gradeSchemes = this._gradeSchemes.asReadonly();
  readonly workflowStages = this._workflowStages.asReadonly();
  readonly resultStatuses = this._resultStatuses.asReadonly();
  readonly examTypes = this._examTypes.asReadonly();

  constructor() {
    this.loadConfigs();
  }

  // Load configs
  loadConfigs() {
    this.examService.getGradeSchemes().subscribe(res => {
      if (res.success) this._gradeSchemes.set(res.data || []);
    });
    this.examService.getWorkflowStages().subscribe(res => {
      if (res.success) this._workflowStages.set(res.data || []);
    });
    this.examService.getResultStatuses().subscribe(res => {
      if (res.success) this._resultStatuses.set(res.data || []);
    });
    this.examService.getExamTypes().subscribe(res => {
      if (res.success) this._examTypes.set(res.data || []);
    });
  }

  // Actions
  loadExams(sessionId: string) {
    this._loading.set(true);
    this.examService.getExams(sessionId)
      .pipe(
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => {
        if (res.success) {
          this._exams.set(res.data || []);
        }
      });
  }

  createExam(data: any, sessionId: string, callback?: () => void) {
    this._loading.set(true);
    this.examService.createExam(data)
      .pipe(
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => {
        if (res.success) {
          this.loadExams(sessionId);
          if (callback) callback();
        }
      });
  }

  addSubjectToExam(examId: string, data: any, sessionId: string, callback?: () => void) {
    this._loading.set(true);
    this.examService.addSubjectToExam(examId, data)
      .pipe(
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => {
        if (res.success) {
          this.loadExams(sessionId);
          if (callback) callback();
        }
      });
  }

  publishAndRank(examId: string, sessionId: string, callback?: () => void) {
    this._loading.set(true);
    this.examService.publishAndRankExam(examId)
      .pipe(
        finalize(() => this._loading.set(false))
      )
      .subscribe(res => {
        if (res.success) {
          this.loadExams(sessionId);
          if (callback) callback();
        }
      });
  }
}
