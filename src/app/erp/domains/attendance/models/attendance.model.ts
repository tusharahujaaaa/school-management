export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';
export type StaffAttendanceStatus = 'present' | 'absent' | 'late' | 'half-day' | 'leave';
export type EntityType = 'student' | 'staff';

// ─── Student ────────────────────────────────────────────
export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  class: string;
  section: string;
  avatar?: string;
}

// ─── Staff ──────────────────────────────────────────────
export interface StaffMember {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  role: string;
  avatar?: string;
}

// ─── Attendance Records ──────────────────────────────────
export interface StudentAttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface StaffAttendanceRecord {
  staffId: string;
  status: StaffAttendanceStatus;
  remarks?: string;
}

// ─── Daily Attendance Session ────────────────────────────
export interface AttendanceSession {
  date: string; // ISO date string
  class: string;
  section: string;
  records: StudentAttendanceRecord[];
  submittedBy?: string;
  submittedAt?: string;
}

// ─── Class-wise Summary ──────────────────────────────────
export interface ClassAttendanceSummary {
  class: string;
  section: string;
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  leave: number;
  percentage: number;
}

// ─── Dashboard Stats ─────────────────────────────────────
export interface AttendanceDashboardStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  onLeave: number;
  overallPercentage: number;
  staffPresent: number;
  staffAbsent: number;
  staffTotal: number;
}

// ─── History Record ──────────────────────────────────────
export interface AttendanceHistoryRecord {
  id: string;
  date: string;
  class: string;
  section: string;
  totalStudents: number;
  present: number;
  absent: number;
  percentage: number;
  markedBy: string;
}

// ─── Low Attendance Alert ────────────────────────────────
export interface LowAttendanceAlert {
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  attendancePercentage: number;
  totalDays: number;
  presentDays: number;
  severity: 'critical' | 'warning';
}

// ─── Report Card ─────────────────────────────────────────
export interface AttendanceReport {
  id: string;
  title: string;
  description: string;
  icon: string;
  colorClass: string;
}

// ─── Filter State ────────────────────────────────────────
export interface AttendanceFilterState {
  selectedDate: string;
  selectedClass: string;
  selectedSection: string;
  searchQuery: string;
}
