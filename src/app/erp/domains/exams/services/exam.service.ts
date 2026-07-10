import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../core/api/base/base-api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/api/models/api-response.model';
import { API_ENDPOINTS } from '../../../core/api/constants/api.constants';

@Injectable({ providedIn: 'root' })
export class ExamService extends BaseApiService {

  // 1. Configs
  getGradeSchemes(): Observable<ApiResponse<any[]>> {
    return this.get<ApiResponse<any[]>>(API_ENDPOINTS.EXAMS.CONFIG_GRADE_SCHEMES);
  }

  createGradeScheme(data: any): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(API_ENDPOINTS.EXAMS.CONFIG_GRADE_SCHEMES, data);
  }

  getWorkflowStages(): Observable<ApiResponse<any[]>> {
    return this.get<ApiResponse<any[]>>(API_ENDPOINTS.EXAMS.CONFIG_WORKFLOW_STAGES);
  }

  getResultStatuses(): Observable<ApiResponse<any[]>> {
    return this.get<ApiResponse<any[]>>(API_ENDPOINTS.EXAMS.CONFIG_RESULT_STATUSES);
  }

  getExamTypes(): Observable<ApiResponse<any[]>> {
    return this.get<ApiResponse<any[]>>(API_ENDPOINTS.EXAMS.CONFIG_TYPES);
  }

  // 2. Exams
  getExams(sessionId: string): Observable<ApiResponse<any[]>> {
    return this.get<ApiResponse<any[]>>(API_ENDPOINTS.EXAMS.BASE, { sessionId });
  }

  createExam(data: any): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(API_ENDPOINTS.EXAMS.BASE, data);
  }

  addSubjectToExam(examId: string, data: any): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(API_ENDPOINTS.EXAMS.SUBJECTS(examId), data);
  }

  // 3. Roster & Save Marks
  getRosterForMarksEntry(examSubjectId: string): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.EXAMS.SUBJECT_ROSTER(examSubjectId));
  }

  bulkSaveExamResults(examSubjectId: string, results: any[]): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(API_ENDPOINTS.EXAMS.SUBJECT_MARKS(examSubjectId), { results });
  }

  // 4. Ranking & Publish
  publishAndRankExam(examId: string): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(API_ENDPOINTS.EXAMS.PUBLISH(examId), {});
  }

  getStudentReportCard(studentId: string, examId: string): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.EXAMS.STUDENT_REPORT(studentId, examId));
  }

  // 5. Results Browser
  getExamResultsSummary(examId: string): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(API_ENDPOINTS.EXAMS.RESULTS(examId));
  }
}
