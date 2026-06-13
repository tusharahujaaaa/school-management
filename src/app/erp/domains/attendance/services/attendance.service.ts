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

import { TeachersHttpService } from '../../teachers/services/teachers-http.service';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private httpSvc = inject(AttendanceHttpService);
  private loadingSvc = inject(LoadingService);
  private teachersHttpSvc = inject(TeachersHttpService);

  private readonly USE_MOCK = false;

  private safeGetItem(key: string): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private safeSetItem(key: string, value: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  }

  private loadSheetStatuses(): Map<string, 'DRAFT' | 'SUBMITTED' | 'LOCKED' | 'EDITED'> {
    const data = this.safeGetItem('erp_attendance_sheet_statuses');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        return new Map(Object.entries(parsed));
      } catch (e) {
        console.error('Error parsing sheet statuses from localStorage:', e);
      }
    }
    return new Map();
  }

  private saveSheetStatuses(map: Map<string, 'DRAFT' | 'SUBMITTED' | 'LOCKED' | 'EDITED'>) {
    const obj = Object.fromEntries(map.entries());
    this.safeSetItem('erp_attendance_sheet_statuses', JSON.stringify(obj));
  }

  // ─── Signals ──────────────────────────────────────
  readonly classes = signal<string[]>([]);
  readonly sections = signal<string[]>([]);
  private _allClasses = signal<any[]>([]);

  readonly sheetStatuses = signal<Map<string, 'DRAFT' | 'SUBMITTED' | 'LOCKED' | 'EDITED'>>(this.loadSheetStatuses());

  readonly classSummaries = computed(() => {
    const summaries = [...MOCK_CLASS_SUMMARIES];
    const activeClass = this.selectedClass();
    const activeSec = this.selectedSection();
    const summary = this.attendanceSummary();

    if (activeClass && activeSec) {
      const idx = summaries.findIndex(s => s.class === activeClass && s.section === activeSec);
      if (idx >= 0) {
        const total = summary.total;
        if (total > 0) {
          const present = summary.present;
          const absent = summary.absent;
          const late = summary.late;
          const leave = summary.leave;
          const pct = Math.round((present / total) * 1000) / 10;
          
          summaries[idx] = {
            class: activeClass,
            section: activeSec,
            totalStudents: total,
            present,
            absent,
            late,
            leave,
            percentage: pct
          };
        }
      }
    }
    return summaries;
  });

  readonly dashboardStats = computed(() => {
    const base = { ...MOCK_ATTENDANCE_STATS };
    const activeSummaries = this.classSummaries();
    
    let totalStudents = 0;
    let present = 0;
    let absent = 0;
    let late = 0;
    let leave = 0;
    
    activeSummaries.forEach(s => {
      totalStudents += s.totalStudents;
      present += s.present;
      absent += s.absent;
      late += s.late;
      leave += s.leave;
    });

    if (totalStudents > 0) {
      base.totalStudents = totalStudents;
      base.presentToday = present;
      base.absentToday = absent;
      base.lateToday = late;
      base.onLeave = leave;
      base.overallPercentage = Math.round((present / totalStudents) * 1000) / 10;
    }
    
    return base;
  });

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
  readonly currentClassId = computed(() => {
    return this.getClassId(this.selectedClass(), this.selectedSection());
  });

  readonly currentClassIdAndDateKey = computed(() => {
    const classId = this.currentClassId();
    const date = this.selectedDate();
    return classId && date ? `${classId}_${date}` : null;
  });

  readonly currentSheetStatus = computed(() => {
    const key = this.currentClassIdAndDateKey();
    if (!key) return 'DRAFT';
    return this.sheetStatuses().get(key) || 'DRAFT';
  });

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

  // ─── Helpers & Validations ────────────────────────
  isFutureDate(dateStr: string): boolean {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(dateStr);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate.getTime() > today.getTime();
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
        let hasMarked = false;
        attendanceData.forEach((item: any) => {
          if (item.status) {
            hasMarked = true;
            recordsMap.set(item.studentId, {
              studentId: item.studentId,
              status: item.status.toLowerCase() as AttendanceStatus,
              remarks: item.remarks || ''
            });
          }
        });
        this._studentRecords.set(recordsMap);

        // Initialize sheet status dynamically
        const key = this.currentClassIdAndDateKey();
        if (key && !this.sheetStatuses().has(key)) {
          this.sheetStatuses.update(map => {
            const updated = new Map(map);
            updated.set(key, hasMarked ? 'SUBMITTED' : 'DRAFT');
            this.saveSheetStatuses(updated);
            return updated;
          });
        }
      }
    });
  }

  markStudentAttendance(studentId: string, status: AttendanceStatus, remarks?: string) {
    if (this.currentSheetStatus() === 'LOCKED') {
      throw new Error('This attendance session is locked and cannot be modified.');
    }
    if (this.isFutureDate(this.selectedDate())) {
      throw new Error('Cannot mark attendance for future dates.');
    }

    this._studentRecords.update(map => {
      const updated = new Map(map);
      updated.set(studentId, { studentId, status, remarks });
      return updated;
    });

    const key = this.currentClassIdAndDateKey();
    if (key && this.currentSheetStatus() === 'SUBMITTED') {
      this.sheetStatuses.update(map => {
        const updated = new Map(map);
        updated.set(key, 'EDITED');
        this.saveSheetStatuses(updated);
        return updated;
      });
    }
  }

  markAllStudents(status: AttendanceStatus) {
    if (this.currentSheetStatus() === 'LOCKED') {
      throw new Error('This attendance session is locked and cannot be modified.');
    }
    if (this.isFutureDate(this.selectedDate())) {
      throw new Error('Cannot mark attendance for future dates.');
    }

    const map = new Map<string, StudentAttendanceRecord>();
    this.students().forEach(s => map.set(s.id, { studentId: s.id, status }));
    this._studentRecords.set(map);

    const key = this.currentClassIdAndDateKey();
    if (key && this.currentSheetStatus() === 'SUBMITTED') {
      this.sheetStatuses.update(map => {
        const updated = new Map(map);
        updated.set(key, 'EDITED');
        this.saveSheetStatuses(updated);
        return updated;
      });
    }
  }

  resetStudentAttendance() {
    if (this.currentSheetStatus() === 'LOCKED') {
      throw new Error('This attendance session is locked and cannot be modified.');
    }
    this._studentRecords.set(new Map());

    const key = this.currentClassIdAndDateKey();
    if (key && this.currentSheetStatus() === 'SUBMITTED') {
      this.sheetStatuses.update(map => {
        const updated = new Map(map);
        updated.set(key, 'EDITED');
        this.saveSheetStatuses(updated);
        return updated;
      });
    }
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

  loadStaffRoster(date: string) {
    if (this.USE_MOCK) return;

    this.teachersHttpSvc.getTeachers().subscribe({
      next: (res) => {
        const teachersList = res?.data || [];
        const mappedStaff = teachersList.map((t: any) => ({
          id: t.id,
          employeeId: t.phone || t.id.slice(0, 8),
          name: t.name,
          department: t.subject || 'General Studies',
          role: 'Teacher',
          avatar: t.photoUrl
        }));
        this.staff.set(mappedStaff);

        // Fetch staff attendance records for this date
        this.httpSvc.getStaffAttendanceHistory({ date }).subscribe({
          next: (historyRes) => {
            const historyList = historyRes?.data?.data || [];
            const recordsMap = new Map<string, StaffAttendanceRecord>();
            historyList.forEach((item: any) => {
              const teacherId = item.studentId; // stored in studentId column on backend schema
              recordsMap.set(teacherId, {
                staffId: teacherId,
                status: item.status.toLowerCase() as StaffAttendanceStatus,
                remarks: item.remarks || ''
              });
            });
            this._staffRecords.set(recordsMap);
          }
        });
      }
    });
  }

  submitStaffAttendance(date: string): Observable<any> {
    if (this.isFutureDate(date)) {
      throw new Error('Cannot submit staff attendance for future dates.');
    }

    const records = Array.from(this._staffRecords().values()).map(r => ({
      teacherId: r.staffId,
      status: r.status.toUpperCase(),
      remarks: r.remarks || ''
    }));

    return this.httpSvc.submitStaffAttendance(date, records);
  }

  saveDraft(): Observable<any> {
    if (this.currentSheetStatus() === 'LOCKED') {
      throw new Error('This attendance session is locked and cannot be modified.');
    }
    if (this.isFutureDate(this.selectedDate())) {
      throw new Error('Cannot save attendance draft for future dates.');
    }

    const key = this.currentClassIdAndDateKey();
    if (key) {
      this.sheetStatuses.update(map => {
        const updated = new Map(map);
        updated.set(key, 'DRAFT');
        this.saveSheetStatuses(updated);
        return updated;
      });
    }
    return of({ success: true, message: 'Draft saved successfully' });
  }

  lockAttendance() {
    const key = this.currentClassIdAndDateKey();
    if (!key) return;
    this.sheetStatuses.update(map => {
      const updated = new Map(map);
      updated.set(key, 'LOCKED');
      this.saveSheetStatuses(updated);
      return updated;
    });
  }

  reopenAttendance() {
    const key = this.currentClassIdAndDateKey();
    if (!key) return;
    this.sheetStatuses.update(map => {
      const updated = new Map(map);
      updated.set(key, 'DRAFT'); // reopen shifts status back to draft/editable
      this.saveSheetStatuses(updated);
      return updated;
    });
  }

  submitAttendance(): Observable<any> {
    const classId = this.getClassId(this.selectedClass(), this.selectedSection());
    if (!classId) {
      throw new Error('Please select a valid class and section first.');
    }

    if (this.isFutureDate(this.selectedDate())) {
      throw new Error('Cannot submit attendance for future dates.');
    }

    if (this.currentSheetStatus() === 'LOCKED') {
      throw new Error('This attendance session is locked and cannot be modified.');
    }

    const records = Array.from(this._studentRecords().values()).map(r => ({
      studentId: r.studentId,
      status: r.status.toUpperCase(),
      remarks: r.remarks || ''
    }));

    return this.httpSvc.submitBulkAttendance(classId, this.selectedDate(), records).pipe(
      tap(() => {
        const key = this.currentClassIdAndDateKey();
        if (key) {
          this.sheetStatuses.update(map => {
            const updated = new Map(map);
            updated.set(key, 'SUBMITTED');
            this.saveSheetStatuses(updated);
            return updated;
          });
        }
        // Refresh statuses upon successful submission
        this.loadStudents();
      })
    );
  }
}
