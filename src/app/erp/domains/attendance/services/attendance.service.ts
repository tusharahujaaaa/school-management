import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Observable, of, tap, forkJoin, catchError } from 'rxjs';
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
  httpSvc = inject(AttendanceHttpService);
  loadingSvc = inject(LoadingService);
  teachersHttpSvc = inject(TeachersHttpService);

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

  private _classSummaries = signal<ClassAttendanceSummary[]>([]);
  private _dashboardStatsBase = signal<AttendanceDashboardStats | null>(null);

  readonly classSummaries = computed(() => {
    const summaries = [...this._classSummaries()];
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
          const pct = Math.round((present / total) * 100);
          
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
    const base = this._dashboardStatsBase() 
      ? { ...this._dashboardStatsBase()! } 
      : {
          totalStudents: 0,
          presentToday: 0,
          absentToday: 0,
          lateToday: 0,
          onLeave: 0,
          overallPercentage: 0,
          staffPresent: 0,
          staffAbsent: 0,
          staffTotal: 0
        };
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
      base.overallPercentage = Math.round((present / totalStudents) * 100);
    }
    
    return base;
  });

  readonly history = signal<AttendanceHistoryRecord[]>([]);
  readonly lowAttendanceAlerts = signal<LowAttendanceAlert[]>([]);
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
              const teacherId = item.teacherId || item.studentId;
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

  // ─── Analytics, Reports & History Dynamic Loaders ────────────────────────

  loadDashboardStats() {
    this.loadingSvc.isLoading.set(true);
    const todayStr = new Date().toISOString().split('T')[0];

    forkJoin({
      analytics: this.httpSvc.getStudentAnalytics().pipe(catchError(() => of(null))),
      daily: this.httpSvc.getDailyReport(todayStr).pipe(catchError(() => of(null))),
      staffHistory: this.httpSvc.getStaffAttendanceHistory({ date: todayStr }).pipe(catchError(() => of(null))),
      teachers: this.teachersHttpSvc.getTeachers().pipe(catchError(() => of(null)))
    }).subscribe({
      next: ({ analytics, daily, staffHistory, teachers }) => {
        // 1. Map student alerts
        const rawAlerts = analytics?.data?.lowAttendanceStudents || [];
        const mappedAlerts: LowAttendanceAlert[] = rawAlerts.map((item: any) => ({
          studentId: item.studentId,
          studentName: item.name,
          class: item.className?.split(' ')[0] || 'Class',
          section: item.className?.split(' ')[1] || 'A',
          attendancePercentage: item.percentage,
          totalDays: 30, // fallback
          presentDays: Math.round((item.percentage / 100) * 30),
          severity: item.percentage < 65 ? 'critical' : 'warning'
        }));
        this.lowAttendanceAlerts.set(mappedAlerts);

        // 2. Map class-wide trends to _classSummaries
        const trends = analytics?.data?.classWiseTrends || [];
        const mappedSummaries: ClassAttendanceSummary[] = trends.map((item: any) => {
          const parts = item.className?.split(' ') || [];
          const cls = parts.slice(0, -1).join(' ') || 'Class';
          const sec = parts[parts.length - 1] || 'A';
          return {
            class: cls,
            section: sec,
            totalStudents: 0,
            present: 0,
            absent: 0,
            late: 0,
            leave: 0,
            percentage: item.percentage
          };
        });

        const dailyRecords = daily?.data?.records || [];
        const dailySummary = daily?.data || {};

        const summariesMap = new Map<string, ClassAttendanceSummary>();
        mappedSummaries.forEach(s => summariesMap.set(`${s.class}_${s.section}`, s));

        dailyRecords.forEach((rec: any) => {
          const cls = rec.student?.class?.name || 'Class';
          const sec = rec.student?.class?.section || 'A';
          const key = `${cls}_${sec}`;
          if (!summariesMap.has(key)) {
            summariesMap.set(key, {
              class: cls,
              section: sec,
              totalStudents: 0,
              present: 0,
              absent: 0,
              late: 0,
              leave: 0,
              percentage: 100
            });
          }
          const sum = summariesMap.get(key)!;
          sum.totalStudents++;
          if (rec.status === 'PRESENT') sum.present++;
          else if (rec.status === 'ABSENT') sum.absent++;
          else if (rec.status === 'LATE') sum.late++;
          else if (rec.status === 'LEAVE') sum.leave++;
        });

        summariesMap.forEach(sum => {
          if (sum.totalStudents > 0) {
            sum.percentage = Math.round((sum.present / sum.totalStudents) * 100);
          }
        });
        this._classSummaries.set(Array.from(summariesMap.values()));

        // 3. Populate overall dashboard stats
        const activeStaffList = teachers?.data || [];
        const staffRecs = staffHistory?.data?.data || [];
        const staffPresentCount = staffRecs.filter((r: any) => r.status === 'PRESENT' || r.status === 'LATE').length;

        this._dashboardStatsBase.set({
          totalStudents: dailySummary.total || 0,
          presentToday: dailySummary.present || 0,
          absentToday: dailySummary.absent || 0,
          lateToday: dailyRecords.filter((r: any) => r.status === 'LATE').length,
          onLeave: dailyRecords.filter((r: any) => r.status === 'LEAVE').length,
          overallPercentage: analytics?.data?.yearlyPercentage || dailySummary.percentage || 0,
          staffPresent: staffPresentCount,
          staffAbsent: activeStaffList.length - staffPresentCount,
          staffTotal: activeStaffList.length || 80
        });

        this.loadingSvc.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading dashboard analytics:', err);
        this.loadingSvc.isLoading.set(false);
      }
    });
  }

  loadStudentHistory(filters: { date?: string; className?: string; sectionName?: string }) {
    this.loadingSvc.isLoading.set(true);
    const classId = filters.className && filters.sectionName
      ? this.getClassId(filters.className, filters.sectionName)
      : undefined;

    this.httpSvc.getStudentHistoryFiltered({
      date: filters.date || undefined,
      classId: classId || undefined,
      sectionId: filters.sectionName || undefined,
      limit: 1000
    }).subscribe({
      next: (res) => {
        const rawData = res?.data?.data || [];
        const grouped = new Map<string, AttendanceHistoryRecord>();

        rawData.forEach((item: any) => {
          const dateStr = item.date ? new Date(item.date).toISOString().split('T')[0] : 'Unknown';
          const cls = item.student?.class?.name || 'Class';
          const sec = item.student?.class?.section || 'A';
          const key = `${dateStr}_${cls}_${sec}`;

          if (!grouped.has(key)) {
            grouped.set(key, {
              id: key,
              date: dateStr,
              class: cls,
              section: sec,
              totalStudents: 0,
              present: 0,
              absent: 0,
              percentage: 0,
              markedBy: item.markedBy || 'Staff'
            });
          }

          const group = grouped.get(key)!;
          group.totalStudents++;
          if (item.status === 'PRESENT' || item.status === 'LATE') {
            group.present++;
          } else if (item.status === 'ABSENT') {
            group.absent++;
          }
        });

        grouped.forEach(group => {
          group.percentage = group.totalStudents > 0
            ? Math.round((group.present / group.totalStudents) * 100)
            : 100;
        });

        this.history.set(Array.from(grouped.values()));
        this.loadingSvc.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading history logs:', err);
        this.loadingSvc.isLoading.set(false);
      }
    });
  }

  loadReportsData(type: string, filters: { class?: string; section?: string; month?: string }) {
    this.loadingSvc.isLoading.set(true);

    if (type === 'daily') {
      const todayStr = new Date().toISOString().split('T')[0];
      this.httpSvc.getDailyReport(todayStr).subscribe({
        next: (res) => {
          const dailyRecords = res?.data?.records || [];
          const summariesMap = new Map<string, ClassAttendanceSummary>();

          dailyRecords.forEach((rec: any) => {
            const cls = rec.student?.class?.name || 'Class';
            const sec = rec.student?.class?.section || 'A';
            const key = `${cls}_${sec}`;

            if (!summariesMap.has(key)) {
              summariesMap.set(key, {
                class: cls,
                section: sec,
                totalStudents: 0,
                present: 0,
                absent: 0,
                late: 0,
                leave: 0,
                percentage: 0
              });
            }
            const sum = summariesMap.get(key)!;
            sum.totalStudents++;
            if (rec.status === 'PRESENT') sum.present++;
            else if (rec.status === 'ABSENT') sum.absent++;
            else if (rec.status === 'LATE') sum.late++;
            else if (rec.status === 'LEAVE') sum.leave++;
          });

          summariesMap.forEach(sum => {
            sum.percentage = sum.totalStudents > 0 ? Math.round((sum.present / sum.totalStudents) * 100) : 100;
          });

          this._classSummaries.set(Array.from(summariesMap.values()));
          this.loadingSvc.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading daily report:', err);
          this.loadingSvc.isLoading.set(false);
        }
      });
    } else if (type === 'monthly') {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const monthIndex = monthNames.indexOf(filters.month || 'May');
      const monthNum = monthIndex >= 0 ? monthIndex + 1 : 5;
      const yearNum = new Date().getFullYear();

      this.httpSvc.getMonthlyReport(monthNum, yearNum).subscribe({
        next: (res) => {
          const reportRows = res?.data?.report || [];
          const summariesMap = new Map<string, ClassAttendanceSummary>();

          reportRows.forEach((row: any) => {
            const classAndSec = row.className || 'Class A';
            const parts = classAndSec.split(' ');
            const cls = parts.slice(0, -1).join(' ') || 'Class';
            const sec = parts[parts.length - 1] || 'A';
            const key = `${cls}_${sec}`;

            if (!summariesMap.has(key)) {
              summariesMap.set(key, {
                class: cls,
                section: sec,
                totalStudents: 0,
                present: 0,
                absent: 0,
                late: 0,
                leave: 0,
                percentage: 0
              });
            }

            const sum = summariesMap.get(key)!;
            sum.totalStudents++;
            sum.present += row.present || 0;
            sum.absent += row.absent || 0;
            sum.late += row.late || 0;
            sum.leave += row.leave || 0;
          });

          summariesMap.forEach(sum => {
            const totalDays = sum.present + sum.absent + sum.late + sum.leave;
            sum.percentage = totalDays > 0 ? Math.round((sum.present / totalDays) * 100) : 100;
          });

          this._classSummaries.set(Array.from(summariesMap.values()));
          this.loadingSvc.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading monthly report:', err);
          this.loadingSvc.isLoading.set(false);
        }
      });
    } else if (type === 'low') {
      this.httpSvc.getLowAttendanceReport(75).subscribe({
        next: (res) => {
          const rawAlerts = res?.data || [];
          const mappedAlerts: LowAttendanceAlert[] = rawAlerts.map((item: any) => ({
            studentId: item.studentId,
            studentName: item.name,
            class: item.className?.split(' ')[0] || 'Class',
            section: item.className?.split(' ')[1] || 'A',
            attendancePercentage: item.percentage,
            totalDays: item.total || 30,
            presentDays: item.present || 0,
            severity: item.percentage < 65 ? 'critical' : 'warning'
          }));
          this.lowAttendanceAlerts.set(mappedAlerts);
          this.loadingSvc.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading low attendance report:', err);
          this.loadingSvc.isLoading.set(false);
        }
      });
    } else if (type === 'staff') {
      const todayStr = new Date().toISOString().split('T')[0];
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
          this.loadingSvc.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading staff for report:', err);
          this.loadingSvc.isLoading.set(false);
        }
      });
    } else if (type === 'logs') {
      this.loadStudentHistory({});
    } else {
      this.loadingSvc.isLoading.set(false);
    }
  }
}
