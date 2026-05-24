import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { LoadingService } from '../../../core/api/services/loading.service';
import { AttendanceHttpService } from './attendance-http.service';
import {
  Student, StaffMember, StudentAttendanceRecord, StaffAttendanceRecord,
  AttendanceDashboardStats, ClassAttendanceSummary, AttendanceHistoryRecord,
  LowAttendanceAlert, AttendanceReport, AttendanceStatus, StaffAttendanceStatus
} from '../models/attendance.model';
import {
  MOCK_STAFF, MOCK_ATTENDANCE_STATS, MOCK_CLASS_SUMMARIES,
  MOCK_ATTENDANCE_HISTORY, MOCK_LOW_ATTENDANCE, MOCK_REPORTS
} from '../mock-data/attendance.mock';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private httpSvc = inject(AttendanceHttpService);
  private loadingSvc = inject(LoadingService);

  private readonly USE_MOCK = false;

  // ─── Signals ──────────────────────────────────────
  readonly classes = signal<string[]>([]);
  readonly sections = signal<string[]>([]);
  private _allClasses = signal<any[]>([]);

  readonly dashboardStats = signal<AttendanceDashboardStats>(MOCK_ATTENDANCE_STATS);
  readonly classSummaries = signal<ClassAttendanceSummary[]>(MOCK_CLASS_SUMMARIES);
  readonly history = signal<AttendanceHistoryRecord[]>(MOCK_ATTENDANCE_HISTORY);
  readonly lowAttendanceAlerts = signal<LowAttendanceAlert[]>(MOCK_LOW_ATTENDANCE);
  readonly reports = signal<AttendanceReport[]>(MOCK_REPORTS);

  readonly selectedDate = signal<string>(new Date().toISOString().split('T')[0]);
  readonly selectedClass = signal<string>('');
  readonly selectedSection = signal<string>('');
  readonly studentSearchQuery = signal<string>('');
  readonly staffSearchQuery = signal<string>('');
  
  readonly isGlobalLoading = this.loadingSvc.isLoading;

  private _studentRecords = signal<Map<string, StudentAttendanceRecord>>(new Map());
  private _staffRecords = signal<Map<string, StaffAttendanceRecord>>(new Map());
  
  readonly students = signal<Student[]>([]);
  readonly staff = signal<StaffMember[]>(MOCK_STAFF);

  // ─── Computed ─────────────────────────────────────
  readonly filteredStudents = computed(() => {
    const q = this.studentSearchQuery().toLowerCase();
    if (!q) return this.students();
    return this.students().filter(s =>
      s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q)
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

  constructor() {
    // Load setup dropdown data on initialization
    this.loadSetupData();

    // Reactive effect: Automatically reload students when date, class, or section changes
    effect(() => {
      const classId = this.getClassId(this.selectedClass(), this.selectedSection());
      const date = this.selectedDate();
      if (classId && date) {
        this.loadStudents();
      } else {
        this.students.set([]);
        this._studentRecords.set(new Map());
      }
    }, { allowSignalWrites: true });
  }

  // ─── Setup Data Loading ────────────────────────────
  loadSetupData() {
    this.httpSvc.getSetupData().subscribe({
      next: (res) => {
        const data = res?.data;
        if (data) {
          this._allClasses.set(data.classes || []);
          this.sections.set(data.sections || []);

          const uniqueClasses = [...new Set((data.classes || []).map((c: any) => c.name))] as string[];
          this.classes.set(uniqueClasses);

          // Auto-select first class & section if available to improve onboarding UX
          if (uniqueClasses.length > 0 && !this.selectedClass()) {
            this.selectedClass.set(uniqueClasses[0]);
          }
          if (data.sections && data.sections.length > 0 && !this.selectedSection()) {
            this.selectedSection.set(data.sections[0]);
          }
        }
      }
    });
  }

  getClassId(className: string, sectionName: string): string | null {
    const cls = this._allClasses().find(c => c.name === className && c.section === sectionName);
    return cls ? cls.id : null;
  }

  // ─── Actions ──────────────────────────────────────
  
  loadStudents() {
    const classId = this.getClassId(this.selectedClass(), this.selectedSection());
    if (!classId) return;

    this.httpSvc.getAttendanceByClassAndDate(classId, this.selectedDate()).subscribe({
      next: (res) => {
        const attendanceData = res?.data?.data || [];
        
        // Map backend list to frontend Student interface
        const mappedStudents = attendanceData.map((item: any) => ({
          id: item.studentId,
          rollNumber: item.rollNumber || '',
          name: item.name || 'Student',
          class: this.selectedClass(),
          section: this.selectedSection()
        }));
        this.students.set(mappedStudents);

        // Pre-populate marked records
        const recordsMap = new Map<string, StudentAttendanceRecord>();
        attendanceData.forEach((item: any) => {
          if (item.status) {
            recordsMap.set(item.studentId, {
              studentId: item.studentId,
              status: item.status.toLowerCase() as AttendanceStatus,
              remarks: item.remarks || ''
            });
          }
        });
        this._studentRecords.set(recordsMap);
      }
    });
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

  submitAttendance(): Observable<any> {
    const classId = this.getClassId(this.selectedClass(), this.selectedSection());
    if (!classId) {
      throw new Error('Please select a valid class and section first.');
    }

    const records = Array.from(this._studentRecords().values()).map(r => ({
      studentId: r.studentId,
      status: r.status.toUpperCase(),
      remarks: r.remarks || ''
    }));

    return this.httpSvc.submitBulkAttendance(classId, this.selectedDate(), records).pipe(
      tap(() => {
        // Refresh statuses upon successful submission
        this.loadStudents();
      })
    );
  }
}
