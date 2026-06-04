import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendancePercentageWidgetComponent } from '../../../components/shared/attendance-percentage-widget/attendance-percentage-widget.component';
import { AuthService } from '../../../../auth/services/auth.service';
import { StudentService } from '../../../../students/services/student.service';
import { AttendanceHttpService } from '../../../services/attendance-http.service';
import { forkJoin } from 'rxjs';

/**
 * Student Portal — Attendance View
 * Shows the logged-in student's own attendance summary, monthly breakdown,
 * and status for recent days.
 * Read-only.
 */
@Component({
  selector: 'app-student-attendance-view',
  standalone: true,
  imports: [CommonModule, AttendancePercentageWidgetComponent],
  templateUrl: './student-attendance-view.component.html',
  styleUrls: ['./student-attendance-view.component.scss']
})
export class StudentAttendanceViewComponent implements OnInit {
  private authSvc = inject(AuthService);
  private studentSvc = inject(StudentService);
  private attendanceHttpSvc = inject(AttendanceHttpService);

  student = signal<any>({
    name: 'Loading...',
    class: '',
    section: '',
    presentDays: 0,
    totalDays: 0,
    attendancePercentage: 0
  });

  monthlyBreakdown = signal<any[]>([]);

  ngOnInit() {
    this.loadStudentData();
  }

  loadStudentData() {
    const currentUserEmail = this.authSvc.currentUser().email;
    
    // 1. Fetch student list to resolve studentId matching user email
    this.studentSvc.getStudentsList().subscribe({
      next: (res: any) => {
        if (res?.success && res.data && res.data.data) {
          const list = res.data.data;
          const match = list.find((s: any) => s.parentEmail === currentUserEmail);
          
          if (match) {
            this.resolveStudentDetails(match.id);
          } else {
            console.warn('No student profile found matching email:', currentUserEmail);
          }
        }
      },
      error: (err) => console.error('Error listing students to resolve email:', err)
    });
  }

  resolveStudentDetails(studentId: string) {
    // 2. Fetch full student profile to get overall stats
    this.studentSvc.getStudentById(studentId).subscribe({
      next: (res: any) => {
        if (res?.success && res.data) {
          const dbStudent = res.data;
          this.student.set({
            id: dbStudent.id,
            name: dbStudent.name,
            rollNumber: dbStudent.rollNumber || 'N/A',
            class: dbStudent.class?.name || 'Class',
            section: dbStudent.class?.section || 'A',
            presentDays: dbStudent.attendanceSummary?.presentDays || 0,
            totalDays: dbStudent.attendanceSummary?.totalDays || 0,
            attendancePercentage: dbStudent.attendanceSummary?.percentage || 0
          });

          // 3. Fetch past 3 months' breakdown
          this.loadMonthlyBreakdown(studentId);
        }
      },
      error: (err) => console.error('Error fetching detailed student profile:', err)
    });
  }

  loadMonthlyBreakdown(studentId: string) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-indexed

    const queries: { monthNum: number; yearNum: number }[] = [];
    for (let i = 0; i < 3; i++) {
      let m = currentMonth - i;
      let y = currentYear;
      if (m <= 0) {
        m += 12;
        y -= 1;
      }
      queries.push({ monthNum: m, yearNum: y });
    }

    const requests = queries.map(q => 
      this.attendanceHttpSvc.getStudentAttendanceSummary(studentId, q.monthNum, q.yearNum)
    );

    forkJoin(requests).subscribe({
      next: (responses: any[]) => {
        const breakdown = responses.map((res: any, idx) => {
          const q = queries[idx];
          const monthName = new Date(q.yearNum, q.monthNum - 1, 1).toLocaleString('default', { month: 'long' });
          if (res?.success && res.data) {
            const d = res.data;
            return {
              month: monthName,
              present: d.present || 0,
              absent: d.absent || 0,
              total: d.totalDays || 0,
              pct: d.percentage || 0
            };
          }
          return {
            month: monthName,
            present: 0,
            absent: 0,
            total: 0,
            pct: 0
          };
        });
        this.monthlyBreakdown.set(breakdown);
      },
      error: (err) => console.error('Error loading monthly breakdown summaries:', err)
    });
  }

  getPctClass(pct: number): string {
    if (pct >= 90) return 'text-green-500';
    if (pct >= 75) return 'text-orange-500';
    return 'text-red-500';
  }
}
