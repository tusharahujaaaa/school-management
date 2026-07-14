# Product Requirement Document (PRD) - Sakai NG Frontend

## 1. Executive Summary & Problem Statement

### 1.1 Context
In the modern educational ecosystem, administrators, teachers, parents, and students require real-time, unified access to academic and financial data. Traditional school management workflows are highly fragmented—relying on disconnected tools such as physical registers, spreadsheets, standalone billing software, and custom grade-entry forms. This leads to operational friction, data silos, transcription errors, and poor transparency.

### 1.2 The Problem
* **Operational Inefficiency:** School admins spend excessive time manually cross-referencing registries, class lists, and fee structures.
* **Information Asymmetry:** Parents lack instant visibility into their children's daily attendance, academic scores, and fee payment statuses, resulting in communication gaps and delayed tuition recovery.
* **Errors in Grading and Attendance:** Manual entry of exam scores and attendance status is error-prone, hard to audit, and slow to aggregate into report cards.
* **Complex Billing Cycles:** Configuring dynamic fee structures (tuition, transport, discounts, waivers) and identifying overdue payments is a major administrative bottleneck.

### 1.3 The Solution (Sakai NG)
**Sakai NG** is a next-generation School Management System (SMS) frontend portal built using Angular 21, PrimeNG 21, and TailwindCSS v4. It consolidates administrative workflows, attendance registries, academic grading, and financial operations into a fast, responsive, and secure Single Page Application (SPA).

---

## 2. Target Audience & User Personas

### 2.1 Admin & Super Admin (School Managers, registrars, principal)
* **Demographics:** Non-technical to moderately technical staff.
* **Core Goal:** Keep school operations running smoothly, audit billing structures, manage staff/student registers, and view school-wide analytics.
* **Frustrations:** System crashes during enrollment spikes, complex user setup, mismatched roll numbers, and confusing financial indicators.
* **Frontend Needs:** Intuitive forms with client-side validation, clean dashboards with interactive charts (Chart.js), and quick-action directories.

### 2.2 Teacher (Educators, tutors)
* **Demographics:** Focus on ease of entry, speed, and mobile responsiveness.
* **Core Goal:** Mark attendance quickly, record grades, check assigned classes, and update subject details.
* **Frustrations:** Clunky grid interfaces that are hard to navigate on mobile, slow load times when marking attendance in class, and complex grade entry tables.
* **Frontend Needs:** Mobile-friendly layouts, spreadsheet-like grade-input tables, and single-click attendance toggles.

### 2.3 Student (Learners)
* **Demographics:** Digital natives who expect modern UI, speed, and simplicity.
* **Core Goal:** View personal schedules, check homework/subjects, and download report cards.
* **Frustrations:** Hard-to-read reports, complex navigation, and lack of visual progress tracking.
* **Frontend Needs:** Clear, printable report card grids and simple personal dashboards.

### 2.4 Parent (Guardians)
* **Goal:** Monitor child's progress, track daily attendance records, and pay invoices online.
* **Frustrations:** Surprise invoices, lack of attendance alerts, and complex payment steps.
* **Frontend Needs:** Clear status cards, easy access to outstanding invoices, and printable PDF receipts.

---

## 3. Product Features & Detailed Workflows

### 3.1 Authentication & Registration Pipeline
* **Secure Portal Entrance:** Responsive login interface validating credentials via backend JWTs.
* **Auto-generated Password Policy:** When a Student/Teacher is created:
  * Username defaults to the provided email. If empty, the system generates a dummy Yopmail address (`[firstname][dob_year][dob_month][dob_day]@yopmail.com`).
  * Temporary password automatically defaults to the last 3 characters of their name + the last 4 digits of their phone number.
  * Credentials are shown in a Toast message (for dummy emails) and emailed automatically.

### 3.2 Student Admission Workflow
* **Admission Path:** `ERP Dashboard -> Students -> Add Student`
* **Form Sections:**
  1. **Personal Info:** Full name, Gender, Date of Birth, Blood group, Photo attachment.
  2. **Academic Mapping:** Selection of Class and Section, Academic Session, Roll Number (auto-generated if empty).
  3. **Parent / Guardian Details:** Parent name, contact number, email, address, emergency contact.
  4. **Services Mapping:** Transportation opt-in, Route/Bus assignment, Pickup/Drop points.
* **Frontend Logic:**
  * If "Uses Transport" is checked, the system forces selection of an active Bus route.
  * Roll and Admission numbers are auto-calculated sequentially on the backend to avoid database collisions.
  * On success, a Toast notification pops up showing the generated credentials if a dummy email was generated.

### 3.3 Attendance Marking System
* **Marking Daily attendance:**
  * Teachers select a Class, Section, and Date.
  * The frontend displays a grid of students with quick-toggle buttons for Present (P), Absent (A), and Late (L).
  * Status changes are committed instantly using reactive state, allowing teachers to mark a class of 40 in under 30 seconds.
* **Roster Mapping:**
  * The frontend correctly maps backend schema properties (`teacherId` and `studentId` references) to prevent data mismatch when viewing attendance histories.

### 3.4 Examination & Grading Matrix
* **Exam Scheduling:** Admins define exam names, classes, dates, and maximum marks per subject.
* **Spreadsheet-style Marks Entry:**
  * Teachers select an Exam, Class, and Subject.
  * A tabular view shows all enrolled students alongside input cells.
  * Auto-validates input against maximum marks (e.g. flags if a teacher enters "85" on a test marked out of "50").
* **Digital Report Cards:**
  * Generates a printable student progress card.
  * Dynamically calculates total marks, subject averages, pass/fail status, and grade ratings (e.g. A, B, C).

### 3.5 Billing & Fee Collections
* **Collections Dashboard:** Financial overview for admins with visual charts (paid vs outstanding).
* **Fee Structure & Mapping:**
  * Admins define school-wide fees (e.g., Admission Fee, monthly tuition).
  * Enrolled students are mapped automatically to standard billing schedules.
  * Payment ledger logs transactions, generates payment slips, and tracks overdue records.

---

## 4. Role Permissions & Security Matrix

### 4.1 Detailed RBAC Access Matrix
The frontend enforces strict routing guards and dynamic UI rendering based on the user's role:

| Module / Action | Super Admin | Admin | Teacher | Parent | Student |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Modify System Settings / Active Sessions | Yes | No | No | No | No |
| Create/Edit Teacher Records | Yes | Yes | No | No | No |
| Delete Student/Teacher Records | Yes | No | No | No | No |
| Enrol Students (Create/Edit) | Yes | Yes | No | No | No |
| Set Class Fee Structures & Wave Fees | Yes | Yes | No | No | No |
| View Financial Ledgers & Audits | Yes | Yes | No | No | No |
| Mark Student Attendance | Yes | Yes | Yes | No | No |
| Input Subject Grades & Exam Marks | Yes | Yes | Yes | No | No |
| View Assigned Classes & Schedule | Yes | Yes | Yes | No | No |
| View Child's Attendance & Report Card | No | No | No | Yes | No |
| View Personal Attendance & Report Card | No | No | No | No | Yes |

---

## 5. Technical Requirements & Design Choices

### 5.1 Why Angular 21?
* **Signals API:** Eliminates complex RxJS state flows (`behaviorsubjects`), reducing boilerplate and rendering lag.
* **Component Compilation:** Standalone components compile into smaller chunks, resulting in faster load times.
* **Routing Speed:** Native support for route lazy-loading ensures the portal loads in under 1 second.

### 5.2 Why PrimeNG 21 & TailwindCSS v4?
* **Design Control:** PrimeNG provides pre-built interactive components (calendars, select dropdowns, tables).
* **Tailwind integration:** TailwindCSS v4 handles core layout configurations, responsive grids, and custom styling modifiers.
* **Dark Mode:** Easy, uniform theme switching using shared HSL CSS variables.

### 5.3 Security Standards
* **Token Storage:** JWTs are stored in secure memory or cookies.
* **Route Guards:** Prevents manual URL manipulation (e.g. prevents a student from typing `/erp/fees` to view financial records).
* **Client-side Validation:** Reactive forms validate inputs before they reach the backend, reducing server load.
