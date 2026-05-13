import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
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

  // ─── Read-only data ──────────────────────────────────────
  readonly classes = signal<string[]>(MOCK_CLASSES);
  readonly sections = signal<string[]>(MOCK_SECTIONS);
  readonly dashboardStats = signal<AttendanceDashboardStats>(MOCK_ATTENDANCE_STATS);
  readonly classSummaries = signal<ClassAttendanceSummary[]>(MOCK_CLASS_SUMMARIES);
  readonly history = signal<AttendanceHistoryRecord[]>(MOCK_ATTENDANCE_HISTORY);
  readonly lowAttendanceAlerts = signal<LowAttendanceAlert[]>(MOCK_LOW_ATTENDANCE);
  readonly reports = signal<AttendanceReport[]>(MOCK_REPORTS);

  // ─── Student Attendance State ────────────────────────────
  readonly selectedDate = signal<string>(new Date().toISOString().split('T')[0]);
  readonly selectedClass = signal<string>('Class 10');
  readonly selectedSection = signal<string>('A');
  readonly studentSearchQuery = signal<string>('');
  readonly isLoadingStudents = signal<boolean>(false);

  private _studentRecords = signal<Map<string, StudentAttendanceRecord>>(new Map());

  readonly students = signal<Student[]>(MOCK_STUDENTS);

  readonly filteredStudents = computed(() => {
    const q = this.studentSearchQuery().toLowerCase();
    if (!q) return this.students();
    return this.students().filter(s =>
      s.name.toLowerCase().includes(q) || s.rollNumber.includes(q)
    );
  });

  readonly studentRecords = computed(() => this._studentRecords());

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

  // ─── Staff Attendance State ──────────────────────────────
  readonly staffSearchQuery = signal<string>('');
  private _staffRecords = signal<Map<string, StaffAttendanceRecord>>(new Map());
  readonly staff = signal<StaffMember[]>(MOCK_STAFF);

  readonly filteredStaff = computed(() => {
    const q = this.staffSearchQuery().toLowerCase();
    if (!q) return this.staff();
    return this.staff().filter(s =>
      s.name.toLowerCase().includes(q) || s.employeeId.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    );
  });

  readonly staffRecords = computed(() => this._staffRecords());

  // ─── Student Attendance Actions ──────────────────────────
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

  // ─── Staff Attendance Actions ────────────────────────────
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

  // ─── Simulated submit ────────────────────────────────────
  submitAttendance(): Observable<{ success: boolean }> {
    return of({ success: true }).pipe(delay(800));
  }
}
