import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../core/api/base/base-api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/api/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ExamService extends BaseApiService {

  // 1. Configs
  getGradeSchemes(): Observable<ApiResponse<any[]>> {
    return this.get<ApiResponse<any[]>>('/exams/config/grade-schemes');
  }

  createGradeScheme(data: any): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>('/exams/config/grade-schemes', data);
  }

  getWorkflowStages(): Observable<ApiResponse<any[]>> {
    return this.get<ApiResponse<any[]>>('/exams/config/workflow-stages');
  }

  getResultStatuses(): Observable<ApiResponse<any[]>> {
    return this.get<ApiResponse<any[]>>('/exams/config/result-statuses');
  }

  getExamTypes(): Observable<ApiResponse<any[]>> {
    return this.get<ApiResponse<any[]>>('/exams/config/exam-types');
  }

  // 2. Exams
  getExams(sessionId: string): Observable<ApiResponse<any[]>> {
    return this.get<ApiResponse<any[]>>('/exams', { sessionId });
  }

  createExam(data: any): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>('/exams', data);
  }

  addSubjectToExam(examId: string, data: any): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(`/exams/${examId}/subjects`, data);
  }

  // 3. Roster & Save Marks
  getRosterForMarksEntry(examSubjectId: string): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(`/exams/subjects/${examSubjectId}/roster`);
  }

  bulkSaveExamResults(examSubjectId: string, results: any[]): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(`/exams/subjects/${examSubjectId}/marks`, { results });
  }

  // 4. Ranking & Publish
  publishAndRankExam(examId: string): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(`/exams/${examId}/publish`, {});
  }

  getStudentReportCard(studentId: string, examId: string): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(`/exams/students/${studentId}/exams/${examId}/report`);
  }

  // 5. Results Browser
  getExamResultsSummary(examId: string): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(`/exams/${examId}/results`);
  }
}
