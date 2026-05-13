import {
  Student, StaffMember, AttendanceDashboardStats,
  ClassAttendanceSummary, AttendanceHistoryRecord,
  LowAttendanceAlert, AttendanceReport, AttendanceHistoryRecord as HistoryRecord
} from '../models/attendance.model';

// ─── Classes & Sections ──────────────────────────────────
export const MOCK_CLASSES = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

export const MOCK_SECTIONS = ['A', 'B', 'C', 'D'];

// ─── Students ────────────────────────────────────────────
export const MOCK_STUDENTS: Student[] = [
  { id: 's1', rollNumber: '01', name: 'Aarav Sharma', class: 'Class 10', section: 'A' },
  { id: 's2', rollNumber: '02', name: 'Priya Patel', class: 'Class 10', section: 'A' },
  { id: 's3', rollNumber: '03', name: 'Rahul Verma', class: 'Class 10', section: 'A' },
  { id: 's4', rollNumber: '04', name: 'Ananya Singh', class: 'Class 10', section: 'A' },
  { id: 's5', rollNumber: '05', name: 'Karan Mehta', class: 'Class 10', section: 'A' },
  { id: 's6', rollNumber: '06', name: 'Sneha Reddy', class: 'Class 10', section: 'A' },
  { id: 's7', rollNumber: '07', name: 'Arjun Kumar', class: 'Class 10', section: 'A' },
  { id: 's8', rollNumber: '08', name: 'Diya Gupta', class: 'Class 10', section: 'A' },
  { id: 's9', rollNumber: '09', name: 'Vivek Nair', class: 'Class 10', section: 'A' },
  { id: 's10', rollNumber: '10', name: 'Ishaan Das', class: 'Class 10', section: 'A' },
  { id: 's11', rollNumber: '11', name: 'Meera Joshi', class: 'Class 10', section: 'A' },
  { id: 's12', rollNumber: '12', name: 'Rohan Kapoor', class: 'Class 10', section: 'A' },
];

// ─── Staff ───────────────────────────────────────────────
export const MOCK_STAFF: StaffMember[] = [
  { id: 'st1', employeeId: 'TCH-001', name: 'Dr. Vivek Sharma', department: 'Physics', role: 'Senior Teacher' },
  { id: 'st2', employeeId: 'TCH-002', name: 'Ms. Anjali Gupta', department: 'Mathematics', role: 'Teacher' },
  { id: 'st3', employeeId: 'TCH-003', name: 'Mr. Rohan Das', department: 'Physical Education', role: 'Teacher' },
  { id: 'st4', employeeId: 'TCH-004', name: 'Mrs. Kavita Singh', department: 'English', role: 'Senior Teacher' },
  { id: 'st5', employeeId: 'TCH-005', name: 'Mr. Suresh Pillai', department: 'Chemistry', role: 'Teacher' },
  { id: 'st6', employeeId: 'ADM-001', name: 'Amit Kumar', department: 'Administration', role: 'Admin Officer' },
  { id: 'st7', employeeId: 'ADM-002', name: 'Sunita Reddy', department: 'Finance', role: 'Accountant' },
  { id: 'st8', employeeId: 'STF-001', name: 'Ramesh Yadav', department: 'Transport', role: 'Coordinator' },
];

// ─── Dashboard Stats ─────────────────────────────────────
export const MOCK_ATTENDANCE_STATS: AttendanceDashboardStats = {
  totalStudents: 2845,
  presentToday: 2688,
  absentToday: 102,
  lateToday: 37,
  onLeave: 18,
  overallPercentage: 94.5,
  staffPresent: 74,
  staffAbsent: 6,
  staffTotal: 80
};

// ─── Class-wise Summary ──────────────────────────────────
export const MOCK_CLASS_SUMMARIES: ClassAttendanceSummary[] = [
  { class: 'Class 10', section: 'A', totalStudents: 45, present: 43, absent: 1, late: 1, leave: 0, percentage: 95.5 },
  { class: 'Class 10', section: 'B', totalStudents: 42, present: 38, absent: 3, late: 1, leave: 0, percentage: 90.5 },
  { class: 'Class 9',  section: 'A', totalStudents: 48, present: 46, absent: 1, late: 0, leave: 1, percentage: 95.8 },
  { class: 'Class 9',  section: 'B', totalStudents: 44, present: 40, absent: 4, late: 0, leave: 0, percentage: 90.9 },
  { class: 'Class 8',  section: 'A', totalStudents: 50, present: 49, absent: 1, late: 0, leave: 0, percentage: 98.0 },
  { class: 'Class 11', section: 'A', totalStudents: 38, present: 30, absent: 6, late: 2, leave: 0, percentage: 78.9 },
  { class: 'Class 12', section: 'A', totalStudents: 36, present: 32, absent: 2, late: 2, leave: 0, percentage: 88.9 },
];

// ─── History Records ─────────────────────────────────────
export const MOCK_ATTENDANCE_HISTORY: AttendanceHistoryRecord[] = [
  { id: 'h1', date: '2026-05-12', class: 'Class 10', section: 'A', totalStudents: 45, present: 43, absent: 2, percentage: 95.5, markedBy: 'Admin' },
  { id: 'h2', date: '2026-05-12', class: 'Class 10', section: 'B', totalStudents: 42, present: 38, absent: 4, percentage: 90.5, markedBy: 'Admin' },
  { id: 'h3', date: '2026-05-11', class: 'Class 10', section: 'A', totalStudents: 45, present: 44, absent: 1, percentage: 97.8, markedBy: 'Admin' },
  { id: 'h4', date: '2026-05-11', class: 'Class 9',  section: 'A', totalStudents: 48, present: 47, absent: 1, percentage: 97.9, markedBy: 'Admin' },
  { id: 'h5', date: '2026-05-10', class: 'Class 11', section: 'A', totalStudents: 38, present: 30, absent: 8, percentage: 78.9, markedBy: 'Admin' },
  { id: 'h6', date: '2026-05-10', class: 'Class 8',  section: 'A', totalStudents: 50, present: 48, absent: 2, percentage: 96.0, markedBy: 'Admin' },
  { id: 'h7', date: '2026-05-09', class: 'Class 12', section: 'A', totalStudents: 36, present: 32, absent: 4, percentage: 88.9, markedBy: 'Admin' },
  { id: 'h8', date: '2026-05-09', class: 'Class 9',  section: 'B', totalStudents: 44, present: 42, absent: 2, percentage: 95.5, markedBy: 'Admin' },
];

// ─── Low Attendance Alerts ───────────────────────────────
export const MOCK_LOW_ATTENDANCE: LowAttendanceAlert[] = [
  { studentId: 'la1', studentName: 'Arjun Mehta', class: 'Class 11', section: 'A', attendancePercentage: 58.3, totalDays: 60, presentDays: 35, severity: 'critical' },
  { studentId: 'la2', studentName: 'Riya Kapoor', class: 'Class 9',  section: 'B', attendancePercentage: 64.5, totalDays: 60, presentDays: 39, severity: 'critical' },
  { studentId: 'la3', studentName: 'Dev Sharma', class: 'Class 12',  section: 'A', attendancePercentage: 70.0, totalDays: 60, presentDays: 42, severity: 'warning' },
  { studentId: 'la4', studentName: 'Pooja Nair', class: 'Class 10',  section: 'B', attendancePercentage: 72.5, totalDays: 60, presentDays: 43, severity: 'warning' },
  { studentId: 'la5', studentName: 'Mohit Singh', class: 'Class 8',  section: 'A', attendancePercentage: 74.0, totalDays: 60, presentDays: 44, severity: 'warning' },
];

// ─── Reports ─────────────────────────────────────────────
export const MOCK_REPORTS: AttendanceReport[] = [
  { id: 'r1', title: 'Daily Attendance Report', description: 'Complete day-wise attendance for all classes', icon: 'pi pi-calendar', colorClass: 'bg-blue-50 text-blue-600' },
  { id: 'r2', title: 'Monthly Summary Report', description: 'Month-over-month attendance trends and analysis', icon: 'pi pi-chart-bar', colorClass: 'bg-purple-50 text-purple-600' },
  { id: 'r3', title: 'Class-wise Report', description: 'Per-class attendance statistics and breakdown', icon: 'pi pi-building', colorClass: 'bg-teal-50 text-teal-600' },
  { id: 'r4', title: 'Staff Attendance Report', description: 'Staff and faculty attendance summary', icon: 'pi pi-id-card', colorClass: 'bg-orange-50 text-orange-600' },
  { id: 'r5', title: 'Low Attendance Students', description: 'Students with attendance below 75% threshold', icon: 'pi pi-exclamation-triangle', colorClass: 'bg-red-50 text-red-600' },
];
