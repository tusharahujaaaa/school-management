import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AttendanceService } from '../../services/attendance.service';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { StatusBadgeComponent, BadgeSeverity } from '../../../../shared/ui/badges/status-badge.component';

@Component({
  selector: 'app-attendance-reports',
  standalone: true,
  imports: [
    CommonModule, FormsModule, SelectModule, ButtonModule, ToastModule, 
    PageHeaderComponent, StatusBadgeComponent
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

  readonly reportOptions = [
    { label: 'Daily Roster Summary', value: 'daily' },
    { label: 'Monthly Class Trends', value: 'monthly' },
    { label: 'Low Attendance Alert (<75%)', value: 'low' },
    { label: 'Staff Attendance Summary', value: 'staff' },
    { label: 'General Attendance Logs', value: 'logs' }
  ];

  readonly classOptions = [
    { label: 'Class 10', value: 'Class 10' },
    { label: 'Class 9', value: 'Class 9' },
    { label: 'Class 8', value: 'Class 8' },
    { label: 'Class 11', value: 'Class 11' },
    { label: 'Class 12', value: 'Class 12' }
  ];

  readonly sectionOptions = [
    { label: 'Section A', value: 'A' },
    { label: 'Section B', value: 'B' },
    { label: 'Section C', value: 'C' }
  ];

  readonly monthOptions = [
    { label: 'January', value: 'January' },
    { label: 'February', value: 'February' },
    { label: 'March', value: 'March' },
    { label: 'April', value: 'April' },
    { label: 'May', value: 'May' },
    { label: 'June', value: 'June' }
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

  exportCSV() {
    try {
      let headers: string[] = [];
      let rows: string[][] = [];
      const reportType = this.selectedReportType();

      if (reportType === 'daily' || reportType === 'monthly') {
        headers = ['Class', 'Section', 'Total Students', 'Present', 'Absent', 'Late', 'Percentage'];
        rows = this.classSummaries().map(c => [
          c.class, c.section, c.totalStudents.toString(), c.present.toString(), c.absent.toString(), c.late.toString(), `${c.percentage}%`
        ]);
      } else if (reportType === 'low') {
        headers = ['Student Name', 'Class', 'Section', 'Present Days', 'Total Days', 'Attendance %', 'Severity'];
        rows = this.alerts().map(a => [
          a.studentName, a.class, a.section, a.presentDays.toString(), a.totalDays.toString(), `${a.attendancePercentage}%`, a.severity
        ]);
      } else if (reportType === 'staff') {
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

      const csvData = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))].join('\n');
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${reportType}_attendance_report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.msg.add({ severity: 'success', summary: 'Export Successful', detail: 'Report CSV has been downloaded.' });
    } catch (e: any) {
      this.msg.add({ severity: 'error', summary: 'Export Failed', detail: e.message || 'Could not compile CSV' });
    }
  }

  generateReport(type: string) {
    this.selectedReportType.set(type);
    this.msg.add({ severity: 'info', summary: 'Report Generated', detail: `Loaded dynamic data for ${this.reportOptions.find(r => r.value === type)?.label}` });
  }
}
