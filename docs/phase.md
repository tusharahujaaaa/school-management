# Sakai NG Frontend Development Phase Specifications

This document outlines the detailed roadmap, components, routing layouts, and stores planned or implemented for each development phase of the frontend.

---

## Phase 1: Core Portal Setup & Authentication
* **Focus:** Groundwork configuration, internationalization fallback, routing pipelines, token interceptors, and user session layouts.
* **Core Components:**
  * `LoginComponent` (`/login`): Secure credentials entry form.
  * `ForgotPasswordComponent` (`/forgot-password`): Captures email and triggers password reset notifications.
  * `AppLayoutComponent` (`/erp`): Core workspace frame wrapping the header topbar, left navigation sidebar, and main router viewport.
* **Core Services & Configurations:**
  * `AuthInterceptor`: Intercepts outbound HTTP requests to append `Authorization: Bearer <token>` headers.
  * `AuthGuard`: Checks JWT availability in memory/cookies to allow access to the `/erp` route tree.
  * `sidebar.config.ts`: Mapped array of navigation links shown to users dynamically based on their role permissions.
  * `en.json` (`/assets/i18n`): Localization translations dictionary loaded via `TranslateService`.

## Phase 2: Roster & Directories Management
* **Focus:** Creating profiles directories, forms, and validation systems for primary entities (Students and Teachers).
* **Core Components:**
  * `StudentListComponent` (`/erp/students`): Renders student directories with column filtering (by Class, Section, Status), paginated tables, and action triggers.
  * `StudentCreateEditComponent` (`/erp/students/new` & `/erp/students/:id/edit`): Multi-tab wizard mapping personal details, academic info, guardian details, and transportation services.
  * `TeacherListComponent` (`/erp/teachers`): Renders a list of teachers and opens dialog popups for registration forms.
* **Core Stores:**
  * `StudentStore`: Signal store containing current student states, loading signals, selection IDs, and functions for HTTP mappings.
  * `TeachersService`: Direct API mappings for teacher registers.

## Phase 3: Daily Attendance Tracking & Academic Setup
* **Focus:** Daily attendance toggling grids, class schedules, and academic session settings.
* **Core Components:**
  * `StudentAttendanceComponent` (`/erp/attendance/students`): Grid interface displaying classroom lists with Present/Absent/Late toggle buttons.
  * `StaffAttendanceComponent` (`/erp/attendance/staff`): Roster marking layouts for staff.
  * `ClassListComponent` (`/erp/academics/classes`): CRUD panel configuring school classrooms and sections.
* **Core Services:**
  * `AttendanceService`: Handles posting daily logs and mapping attendance history parameters.
  * `ClassesService`: Tracks session states and active school semesters.

## Phase 4: Assessment & Grades Registration
* **Focus:** Exams scheduler, grade spreadsheets, and report cards.
* **Core Components:**
  * `ExamsDashboardComponent` (`/erp/exams`): Overview displaying upcoming exam dates.
  * `MarksEntryComponent` (`/erp/exams/marks-entry`): Tabular spreadsheet-like grid mapping class students to input fields for subject grade entries.
  * `ReportCardComponent` (`/erp/students/:id/report-card`): Digital, printable sheet displaying averages, grade ratings, and pass/fail states.

## Phase 5: Financial Operations & Ledgers
* **Focus:** Fee configuration dashboards, bill collection ledgers, and overdue invoice tracking.
* **Core Components:**
  * `FeeDashboardComponent` (`/erp/fees`): High-level collections metrics panels utilizing Chart.js.
  * `FeeStructureComponent` (`/erp/fees/structures`): Admins construct fee structures (admission fees, monthly tuition).
  * `FeeOverdueLogsComponent` (`/erp/fees/overdue`): Lists delinquent profiles with options to send reminders.

## Phase 6: Reporting Engine & Settings Control
* **Focus:** School analytics, charts, and system settings.
* **Core Components:**
  * `DashboardComponent` (`/erp/dashboard`): General analytics panel displaying registration numbers, monthly attendance averages, and fee collections.
  * `SettingsComponent` (`/erp/settings`): Configures global school parameters, profile branding, and system preferences.
