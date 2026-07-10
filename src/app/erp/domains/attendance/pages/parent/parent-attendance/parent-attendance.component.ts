import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../auth/services/auth.service';
import { StudentService } from '../../../../students/services/student.service';
import { AttendanceHttpService } from '../../../services/attendance-http.service';
import { AttendancePercentageWidgetComponent } from '../../../components/shared/attendance-percentage-widget/attendance-percentage-widget.component';
import { AttendanceHistoryCardComponent } from '../../../components/shared/attendance-history-card/attendance-history-card.component';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Parent Portal — Attendance View
 * Shows a child's attendance summary, percentage widget, and recent history.
 * Read-only: no editing controls.
 */
@Component({
  selector: 'app-parent-attendance',
  standalone: true,
  imports: [
        CommonModule, AttendancePercentageWidgetComponent, AttendanceHistoryCardComponent, TranslatePipe
    ],
  templateUrl: './parent-attendance.component.html',
  styleUrls: ['./parent-attendance.component.scss']
})
export class ParentAttendanceComponent implements OnInit {
  private authSvc = inject(AuthService);
  private studentSvc = inject(StudentService);
  private attendanceHttpSvc = inject(AttendanceHttpService);

  child = signal<any>({
    name: 'Loading...',
    class: '',
    section: '',
    presentDays: 0,
    totalDays: 0,
    attendancePercentage: 0
  });

  // Recent child records mapped to AttendanceHistoryRecord format
  historyRecords = signal<any[]>([]);

  recentHistory = computed(() => this.historyRecords().slice(0, 6));

  // Low attendance alert for this child (computed dynamically from stats)
  alert = computed(() => {
    
    const childVal = this.child();
    const pct = childVal.attendancePercentage;
    const total = childVal.totalDays;
    
    // Only display alert when data is fully loaded and totalDays > 0
    if (total > 0 && pct < 75) {
      return {
        studentId: childVal.id,
        studentName: childVal.name,
        class: childVal.class,
        section: childVal.section,
        attendancePercentage: pct,
        totalDays: total,
        presentDays: childVal.presentDays,
        severity: pct < 50 ? ('critical' as const) : ('warning' as const)
      };
    }
    return null;
  });

  ngOnInit() {
    this.loadChildData();
  }

  loadChildData() {
    const parentEmail = this.authSvc.currentUser().email;

    // 1. Fetch student list to resolve child by parentEmail
    this.studentSvc.getStudentsList().subscribe({
      next: (res: any) => {
        if (res?.success && res.data && res.data.data) {
          const list = res.data.data;
          const match = list.find((s: any) => s.parentEmail === parentEmail);

          if (match) {
            this.resolveChildDetails(match.id);
          } else {
            console.warn('No child profile found matching parent email:', parentEmail);
          }
        }
      },
      error: (err) => console.error('Error listing students to resolve parent-child:', err)
    });
  }

  resolveChildDetails(childId: string) {
    // 2. Fetch full student profile to get overall stats
    this.studentSvc.getStudentById(childId).subscribe({
      next: (res: any) => {
        if (res?.success && res.data) {
          const dbStudent = res.data;
          this.child.set({
            id: dbStudent.id,
            name: dbStudent.name,
            rollNumber: dbStudent.rollNumber || 'N/A',
            class: dbStudent.class?.name || 'Class',
            section: dbStudent.class?.section || 'A',
            presentDays: dbStudent.attendanceSummary?.presentDays || 0,
            totalDays: dbStudent.attendanceSummary?.totalDays || 0,
            attendancePercentage: dbStudent.attendanceSummary?.percentage || 0
          });

          // 3. Fetch detailed daily history
          this.loadChildHistory(childId);
        }
      },
      error: (err) => console.error('Error fetching detailed child profile:', err)
    });
  }

  loadChildHistory(childId: string) {
    this.attendanceHttpSvc.getStudentAttendanceHistory(childId).subscribe({
      next: (res: any) => {
        if (res?.success && res.data && Array.isArray(res.data.data)) {
          const mapped = res.data.data.map((item: any) => {
            const statusUpper = (item.status || '').toUpperCase();
            const isPresent = statusUpper === 'PRESENT' || statusUpper === 'LATE';
            return {
              id: item.id,
              date: item.date,
              class: this.child().class,
              section: this.child().section,
              totalStudents: 1,
              present: isPresent ? 1 : 0,
              absent: statusUpper === 'ABSENT' ? 1 : 0,
              percentage: isPresent ? 100 : 0,
              markedBy: item.markedBy || 'Teacher'
            };
          });
          this.historyRecords.set(mapped);
        }
      },
      error: (err) => console.error('Error fetching student attendance history:', err)
    });
  }
}
