import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';
import { LoadingService } from '../../../core/api/services/loading.service';
import { AttendanceHttpService } from './attendance-http.service';
import {
  Student, StaffMember, StudentAttendanceRecord, StaffAttendanceRecord,
  AttendanceDashboardStats, ClassAttendanceSummary, AttendanceHistoryRecord,
  LowAttendanceAlert, AttendanceReport, AttendanceStatus, StaffAttendanceStatus
} from '../models/attendance.model';
import {
  MOCK_STUDENTS, MOCK_STAFF, MOCK_ATTENDANCE_STATS, MOCK_CLASS_SUMMARIES,
  MOCK_ATTENDANCE_HISTORY, MOCK_LOW_ATTENDANCE, MOCK_REPORTS,
  MOCK_CLASSES, MOCK_SECTIONS
} from '../mock-data/attendance.mock';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private httpSvc = inject(AttendanceHttpService);
  private loadingSvc = inject(LoadingService);

  /**
   * Flag to toggle between MOCK and REAL API
   * Currently set to true (MOCK) as per requirements
   */
  private readonly USE_MOCK = true;

  // ─── Signals ──────────────────────────────────────
  readonly classes = signal<string[]>(MOCK_CLASSES);
  readonly sections = signal<string[]>(MOCK_SECTIONS);
  readonly dashboardStats = signal<AttendanceDashboardStats>(MOCK_ATTENDANCE_STATS);
  readonly classSummaries = signal<ClassAttendanceSummary[]>(MOCK_CLASS_SUMMARIES);
  readonly history = signal<AttendanceHistoryRecord[]>(MOCK_ATTENDANCE_HISTORY);
  readonly lowAttendanceAlerts = signal<LowAttendanceAlert[]>(MOCK_LOW_ATTENDANCE);
  readonly reports = signal<AttendanceReport[]>(MOCK_REPORTS);

  readonly selectedDate = signal<string>(new Date().toISOString().split('T')[0]);
  readonly selectedClass = signal<string>('Class 10');
  readonly selectedSection = signal<string>('A');
  readonly studentSearchQuery = signal<string>('');
  readonly staffSearchQuery = signal<string>('');
  
  // Use core LoadingService signal
  readonly isGlobalLoading = this.loadingSvc.isLoading;

  private _studentRecords = signal<Map<string, StudentAttendanceRecord>>(new Map());
  private _staffRecords = signal<Map<string, StaffAttendanceRecord>>(new Map());
  
  readonly students = signal<Student[]>(MOCK_STUDENTS);
  readonly staff = signal<StaffMember[]>(MOCK_STAFF);

  // ─── Computed ─────────────────────────────────────
  readonly filteredStudents = computed(() => {
    const q = this.studentSearchQuery().toLowerCase();
    if (!q) return this.students();
    return this.students().filter(s =>
      s.name.toLowerCase().includes(q) || s.rollNumber.includes(q)
    );
  });

  readonly filteredStaff = computed(() => {
    const q = this.staffSearchQuery().toLowerCase();
    if (!q) return this.staff();
    return this.staff().filter(s =>
      s.name.toLowerCase().includes(q) || s.employeeId.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    );
  });

  readonly studentRecords = computed(() => this._studentRecords());
  readonly staffRecords = computed(() => this._staffRecords());

  readonly attendanceSummary = computed(() => {
    const records = this._studentRecords();
    let present = 0, absent = 0, late = 0, leave = 0;
    records.forEach(r => {
      if (r.status === 'present') present++;
      else if (r.status === 'absent') absent++;
      else if (r.status === 'late') late++;
      else if (r.status === 'leave') leave++;
    });
    const total = this.students().length;
    return { present, absent, late, leave, total, unmarked: total - records.size };
  });

  // ─── Actions ──────────────────────────────────────
  
  /**
   * Loads students based on current filters.
   * Demonstrates the switch between MOCK and HTTP.
   */
  loadStudents() {
    if (this.USE_MOCK) {
      // Mock logic: Already handled by static signals for now
      return;
    }

    this.httpSvc.getStudents(this.selectedClass(), this.selectedSection())
      .subscribe(students => this.students.set(students));
  }

  markStudentAttendance(studentId: string, status: AttendanceStatus, remarks?: string) {
    this._studentRecords.update(map => {
      const updated = new Map(map);
      updated.set(studentId, { studentId, status, remarks });
      return updated;
    });
  }

  markAllStudents(status: AttendanceStatus) {
    const map = new Map<string, StudentAttendanceRecord>();
    this.students().forEach(s => map.set(s.id, { studentId: s.id, status }));
    this._studentRecords.set(map);
  }

  resetStudentAttendance() {
    this._studentRecords.set(new Map());
  }

  getStudentStatus(studentId: string): AttendanceStatus | null {
    return this._studentRecords()?.get(studentId)?.status ?? null;
  }

  markStaffAttendance(staffId: string, status: StaffAttendanceStatus, remarks?: string) {
    this._staffRecords.update(map => {
      const updated = new Map(map);
      updated.set(staffId, { staffId, status, remarks });
      return updated;
    });
  }

  markAllStaff(status: StaffAttendanceStatus) {
    const map = new Map<string, StaffAttendanceRecord>();
    this.staff().forEach(s => map.set(s.id, { staffId: s.id, status }));
    this._staffRecords.set(map);
  }

  resetStaffAttendance() {
    this._staffRecords.set(new Map());
  }

  getStaffStatus(staffId: string): StaffAttendanceStatus | null {
    return this._staffRecords()?.get(staffId)?.status ?? null;
  }

  /**
   * Submits attendance to the backend (or simulates it)
   */
  submitAttendance(): Observable<any> {
    if (this.USE_MOCK) {
      return of({ success: true }).pipe(delay(800));
    }

    const payload = Array.from(this._studentRecords().values());
    return this.httpSvc.submitAttendance(payload).pipe(
      tap(() => this.resetStudentAttendance())
    );
  }
}
