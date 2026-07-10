import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AttendanceService } from '../../services/attendance.service';
import { StatusBadgeComponent, BadgeSeverity } from '../../../../shared/ui/badges/status-badge.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-attendance-reports',
  standalone: true,
  imports: [
        CommonModule, FormsModule, SelectModule, ButtonModule, ToastModule, StatusBadgeComponent, TranslatePipe
    ],
  providers: [MessageService],
  templateUrl: './attendance-reports.component.html',
  styleUrls: ['./attendance-reports.component.scss']
})
export class AttendanceReportsComponent {
  svc = inject(AttendanceService);
  private msg = inject(MessageService);

  // Signals for reports & filters
  reports = this.svc.reports;
  alerts = this.svc.lowAttendanceAlerts;
  stats = this.svc.dashboardStats;
  classSummaries = this.svc.classSummaries;

  // Selected filter states
  selectedReportType = signal<string>('daily');
  selectedClass = signal<string>('Class 10');
  selectedSection = signal<string>('A');
  selectedMonth = signal<string>('May');

  constructor() {
    // Automatically fetch report data from APIs when filters are updated
    effect(() => {
      this.svc.loadReportsData(this.selectedReportType(), {
        class: this.selectedClass(),
        section: this.selectedSection(),
        month: this.selectedMonth()
      });
    }, { allowSignalWrites: true });

    // Auto-select defaults when class/sections setup data is resolved from backend
    effect(() => {
      const cls = this.svc.classes();
      const secs = this.svc.sections();
      if (cls.length > 0 && !cls.includes(this.selectedClass())) {
        this.selectedClass.set(cls[0]);
      }
      if (secs.length > 0 && !secs.includes(this.selectedSection())) {
        this.selectedSection.set(secs[0]);
      }
    }, { allowSignalWrites: true });
  }

  readonly reportOptions = [
    { label: 'Daily Roster Summary', value: 'daily' },
    { label: 'Monthly Class Trends', value: 'monthly' },
    { label: 'Low Attendance Alert (<75%)', value: 'low' },
    { label: 'Staff Attendance Summary', value: 'staff' },
    { label: 'General Attendance Logs', value: 'logs' }
  ];

  get classOptions() {
    return this.svc.classes().map(c => ({ label: c, value: c }));
  }

  get sectionOptions() {
    return this.svc.sections().map(s => ({ label: `Section ${s}`, value: s }));
  }

  readonly monthOptions = [
    { label: 'January', value: 'January' },
    { label: 'February', value: 'February' },
    { label: 'March', value: 'March' },
    { label: 'April', value: 'April' },
    { label: 'May', value: 'May' },
    { label: 'June', value: 'June' },
    { label: 'July', value: 'July' },
    { label: 'August', value: 'August' },
    { label: 'September', value: 'September' },
    { label: 'October', value: 'October' },
    { label: 'November', value: 'November' },
    { label: 'December', value: 'December' }
  ];

  // Dynamic filter lists
  filteredAlerts = computed(() => {
    const cls = this.selectedClass();
    const sec = this.selectedSection();
    return this.alerts().filter(a => a.class === cls && a.section === sec);
  });

  filteredSummaries = computed(() => {
    const cls = this.selectedClass();
    return this.classSummaries().filter(c => c.class === cls);
  });

  exportCSV(type?: string) {
    const activeType = this.selectedReportType();
    const targetType = type || activeType;

    // Helper to download the CSV string
    const triggerDownload = (filename: string, headers: string[], rows: string[][]) => {
      const csvData = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))].join('\n');
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.msg.add({ severity: 'success', summary: 'Export Successful', detail: `${filename} has been downloaded.` });
    };

    // If exporting the active report that is already loaded in UI signals
    if (!type || type === activeType) {
      try {
        let headers: string[] = [];
        let rows: string[][] = [];

        if (targetType === 'daily' || targetType === 'monthly') {
          headers = ['Class', 'Section', 'Total Students', 'Present', 'Absent', 'Late', 'Percentage'];
          rows = this.classSummaries().map(c => [
            c.class, c.section, c.totalStudents.toString(), c.present.toString(), c.absent.toString(), c.late.toString(), `${c.percentage}%`
          ]);
        } else if (targetType === 'low') {
          headers = ['Student Name', 'Class', 'Section', 'Present Days', 'Total Days', 'Attendance %', 'Severity'];
          rows = this.alerts().map(a => [
            a.studentName, a.class, a.section, a.presentDays.toString(), a.totalDays.toString(), `${a.attendancePercentage}%`, a.severity
          ]);
        } else if (targetType === 'staff') {
          headers = ['Employee ID', 'Name', 'Department', 'Role', 'Status'];
          rows = this.svc.staff().map(s => [
            s.employeeId, s.name, s.department, s.role, 'Present'
          ]);
        } else {
          headers = ['Date', 'Class', 'Section', 'Total Students', 'Present', 'Absent', 'Percentage', 'Marked By'];
          rows = this.svc.history().map(h => [
            h.date, h.class, h.section, h.totalStudents.toString(), h.present.toString(), h.absent.toString(), `${h.percentage}%`, h.markedBy
          ]);
        }
        triggerDownload(`${targetType}_attendance_report.csv`, headers, rows);
      } catch (e: any) {
        this.msg.add({ severity: 'error', summary: 'Export Failed', detail: e.message || 'Could not compile CSV' });
      }
      return;
    }

    // Otherwise, fetch and compile report data in the background
    this.svc.loadingSvc.isLoading.set(true);
    const todayStr = new Date().toISOString().split('T')[0];

    if (targetType === 'daily') {
      this.svc.httpSvc.getDailyReport(todayStr).subscribe({
        next: (res) => {
          const dailyRecords = res?.data?.records || [];
          const summariesMap = new Map<string, any>();

          dailyRecords.forEach((rec: any) => {
            const cls = rec.student?.class?.name || 'Class';
            const sec = rec.student?.class?.section || 'A';
            const key = `${cls}_${sec}`;

            if (!summariesMap.has(key)) {
              summariesMap.set(key, { class: cls, section: sec, totalStudents: 0, present: 0, absent: 0, late: 0, leave: 0, percentage: 0 });
            }
            const sum = summariesMap.get(key)!;
            sum.totalStudents++;
            if (rec.status === 'PRESENT') sum.present++;
            else if (rec.status === 'ABSENT') sum.absent++;
            else if (rec.status === 'LATE') sum.late++;
            else if (rec.status === 'LEAVE') sum.leave++;
          });

          const rows = Array.from(summariesMap.values()).map(sum => {
            const pct = sum.totalStudents > 0 ? Math.round((sum.present / sum.totalStudents) * 100) : 100;
            return [sum.class, sum.section, sum.totalStudents.toString(), sum.present.toString(), sum.absent.toString(), sum.late.toString(), `${pct}%`];
          });

          triggerDownload(`daily_attendance_report_${todayStr}.csv`, ['Class', 'Section', 'Total Students', 'Present', 'Absent', 'Late', 'Percentage'], rows);
          this.svc.loadingSvc.isLoading.set(false);
        },
        error: (err) => {
          this.msg.add({ severity: 'error', summary: 'Export Failed', detail: 'Could not fetch daily report' });
          this.svc.loadingSvc.isLoading.set(false);
        }
      });
    } else if (targetType === 'monthly') {
      const now = new Date();
      const monthNum = now.getMonth() + 1;
      const yearNum = now.getFullYear();

      this.svc.httpSvc.getMonthlyReport(monthNum, yearNum).subscribe({
        next: (res) => {
          const reportRows = res?.data?.report || [];
          const summariesMap = new Map<string, any>();

          reportRows.forEach((row: any) => {
            const classAndSec = row.className || 'Class A';
            const parts = classAndSec.split(' ');
            const cls = parts.slice(0, -1).join(' ') || 'Class';
            const sec = parts[parts.length - 1] || 'A';
            const key = `${cls}_${sec}`;

            if (!summariesMap.has(key)) {
              summariesMap.set(key, { class: cls, section: sec, totalStudents: 0, present: 0, absent: 0, late: 0, leave: 0, percentage: 0 });
            }

            const sum = summariesMap.get(key)!;
            sum.totalStudents++;
            sum.present += row.present || 0;
            sum.absent += row.absent || 0;
            sum.late += row.late || 0;
            sum.leave += row.leave || 0;
          });

          const rows = Array.from(summariesMap.values()).map(sum => {
            const totalDays = sum.present + sum.absent + sum.late + sum.leave;
            const pct = totalDays > 0 ? Math.round((sum.present / totalDays) * 100) : 100;
            return [sum.class, sum.section, sum.totalStudents.toString(), sum.present.toString(), sum.absent.toString(), sum.late.toString(), `${pct}%`];
          });

          triggerDownload(`monthly_attendance_report_M${monthNum}_Y${yearNum}.csv`, ['Class', 'Section', 'Total Students', 'Present', 'Absent', 'Late', 'Percentage'], rows);
          this.svc.loadingSvc.isLoading.set(false);
        },
        error: (err) => {
          this.msg.add({ severity: 'error', summary: 'Export Failed', detail: 'Could not fetch monthly report' });
          this.svc.loadingSvc.isLoading.set(false);
        }
      });
    } else if (targetType === 'low') {
      this.svc.httpSvc.getLowAttendanceReport(75).subscribe({
        next: (res) => {
          const rawAlerts = res?.data || [];
          const rows = rawAlerts.map((item: any) => {
            const cls = item.className?.split(' ')[0] || 'Class';
            const sec = item.className?.split(' ')[1] || 'A';
            const severity = item.percentage < 65 ? 'Critical' : 'Warning';
            return [item.name, cls, sec, (item.present || 0).toString(), (item.total || 30).toString(), `${item.percentage}%`, severity];
          });

          triggerDownload(`low_attendance_students_under_75.csv`, ['Student Name', 'Class', 'Section', 'Present Days', 'Total Days', 'Attendance %', 'Severity'], rows);
          this.svc.loadingSvc.isLoading.set(false);
        },
        error: (err) => {
          this.msg.add({ severity: 'error', summary: 'Export Failed', detail: 'Could not fetch low attendance report' });
          this.svc.loadingSvc.isLoading.set(false);
        }
      });
    } else if (targetType === 'staff') {
      this.svc.teachersHttpSvc.getTeachers().subscribe({
        next: (res) => {
          const teachersList = res?.data || [];
          const rows = teachersList.map((t: any) => [
            t.phone || t.id.slice(0, 8),
            t.name,
            t.subject || 'General Studies',
            'Teacher',
            'Present'
          ]);

          triggerDownload(`staff_attendance_report.csv`, ['Employee ID', 'Name', 'Department', 'Role', 'Status'], rows);
          this.svc.loadingSvc.isLoading.set(false);
        },
        error: (err) => {
          this.msg.add({ severity: 'error', summary: 'Export Failed', detail: 'Could not fetch staff report' });
          this.svc.loadingSvc.isLoading.set(false);
        }
      });
    } else if (targetType === 'logs') {
      this.svc.httpSvc.getStudentHistoryFiltered({ limit: 1000 }).subscribe({
        next: (res) => {
          const rawData = res?.data?.data || [];
          const groupedMap = new Map<string, any>();

          rawData.forEach((item: any) => {
            const dateStr = item.date ? new Date(item.date).toISOString().split('T')[0] : 'Unknown';
            const cls = item.student?.class?.name || 'Class';
            const sec = item.student?.class?.section || 'A';
            const key = `${dateStr}_${cls}_${sec}`;

            if (!groupedMap.has(key)) {
              groupedMap.set(key, { date: dateStr, class: cls, section: sec, totalStudents: 0, present: 0, absent: 0, markedBy: item.markedBy || 'Staff' });
            }

            const group = groupedMap.get(key)!;
            group.totalStudents++;
            if (item.status === 'PRESENT' || item.status === 'LATE') {
              group.present++;
            } else if (item.status === 'ABSENT') {
              group.absent++;
            }
          });

          const rows = Array.from(groupedMap.values()).map(g => {
            const pct = g.totalStudents > 0 ? Math.round((g.present / g.totalStudents) * 100) : 100;
            return [g.date, g.class, g.section, g.totalStudents.toString(), g.present.toString(), g.absent.toString(), `${pct}%`, g.markedBy];
          });

          triggerDownload(`attendance_history_logs.csv`, ['Date', 'Class', 'Section', 'Total Students', 'Present', 'Absent', 'Percentage', 'Marked By'], rows);
          this.svc.loadingSvc.isLoading.set(false);
        },
        error: (err) => {
          this.msg.add({ severity: 'error', summary: 'Export Failed', detail: 'Could not fetch attendance logs' });
          this.svc.loadingSvc.isLoading.set(false);
        }
      });
    } else {
      this.svc.loadingSvc.isLoading.set(false);
    }
  }

  generateReport(type: string) {
    this.selectedReportType.set(type);
    this.msg.add({ severity: 'info', summary: 'Report Generated', detail: `Loaded dynamic data for ${this.reportOptions.find(r => r.value === type)?.label}` });
  }
}
