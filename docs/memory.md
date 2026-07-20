# Sakai NG Frontend Memory Log

This file is a living document that tracks architectural modifications, bug fixes, features built, and general maintenance logs for the frontend.

## History Logs

### 2026-07-20: Resolved Silent Errors and Date Validation Gaps
- **Files changed:** `src/app/erp/domains/students/pages/student-profile/student-profile.component.ts`, `src/app/erp/domains/students/pages/student-profile/student-profile.component.html`, `src/app/erp/domains/exams/pages/marks-entry/marks-entry.component.ts`, `src/app/erp/domains/fees/pages/fee-records/fee-records.component.ts`, `src/app/erp/domains/fees/pages/fee-records/fee-records.component.html`
- **Changes made:** Bound PrimeNG `MessageService` toast notifications to handle errors on marks-entry roster, student-profile ledger, and student-profile fee configuration queries rather than logging silently. Added `[max]` dynamic constraints and a reactive validator `noFutureDate` inside `FeeRecordsComponent` to block cashier/staff registration of payments with future dates.

### 2026-07-20: Refactored CSV Split Logic to Shared Utility
- **Files added:** `src/app/erp/shared/utils/csv.utils.ts`
- **Files changed:** `src/app/erp/domains/exams/pages/marks-entry/marks-entry.component.ts`, `src/app/erp/domains/admissions/pages/admit-bulk/admit-bulk.component.ts`
- **Changes made:** Extracted the regex-aware `splitCSVLine` function (which ignores commas inside double-quoted values) into a shared utility file. Refactored both `MarksEntryComponent` and `AdmitBulkComponent` to import and call this common utility rather than holding duplicate private implementations.

### 2026-07-20: Resolved Auth Startup Permissions Collision
- **Files changed:** `src/app/erp/core/api/constants/api.constants.ts`, `src/app/erp/domains/auth/services/auth.service.ts`
- **Changes made:** Redirected active academic session query from the teacher-restricted `/attendance/students/setup` endpoint to the new, role-agnostic `/auth/session` backend route. This allows non-administrative roles (e.g. students or parents) to resolve active session storage variables successfully on login without triggers console `403 Forbidden` exceptions.

### 2026-07-20: Resolved RxJS Subscription Memory Leaks
- **Files changed:** `src/app/erp/domains/students/pages/student-list/student-list.component.ts`, `src/app/erp/domains/students/pages/student-profile/student-profile.component.ts`, `src/app/erp/domains/teachers/pages/teacher-list/teacher-list.component.ts`, `src/app/erp/domains/transport/pages/bus-list/bus-list.component.ts`, `src/app/erp/domains/exams/pages/marks-entry/marks-entry.component.ts`
- **Changes made:** Injected `DestroyRef` and applied the RxJS `takeUntilDestroyed` operator on all component level subscriptions (router parameter maps, form value changes, and HTTP updates). This forces all active subscriptions to unsubscribe upon component destruction, preventing SPA cumulative memory leaks.

### 2026-07-20: Cleaned up Mock Files and Optimized Production Bundle
- **Files changed:** `src/app/erp/domains/attendance/services/attendance.service.ts`, `src/app/erp/domains/dashboard/services/dashboard.service.ts`, `src/app/erp/domains/dashboard/services/notification.service.ts`, `src/app/erp/shared/components/global-search/services/global-search.service.ts`
- **Files deleted:** `src/app/erp/domains/attendance/mock-data/attendance.mock.ts`, `src/app/erp/domains/dashboard/store/dashboard.mock.ts`, `src/app/erp/domains/students/mock-data/students.mock.ts`, `src/app/erp/shared/components/global-search/mock-data/global-search.mock.ts`
- **Changes made:** Removed heavy mock data file imports and fallback assignments across domain services and the global search component. Moved static structures like report layout cards metadata and dashboard quick actions configurations to local service constants. Initialized runtime signals (staff, events, notifications) as empty arrays `[]` (since they are fully populated dynamically via backend APIs). Deleted the unreferenced mock data files to clean the codebase and guarantee compiler tree-shaking, reducing final bundle size.

### 2026-07-15: Added Workspace AI Instruction Rules
- **Files added:** `README.md`, `.cursorrules`, `.clinerules`, `.windsurfrules` in workspace root.
- **Files changed:** `sakai-ng/README.md`, `sakai-ng/.cursorrules`, `sakai-ng/.clinerules`, `sakai-ng/.windsurfrules`.
- **Changes made:** Created configuration rules files and a master workspace `README.md` listing ALL 6 files inside both frontend/backend projects `docs/` folders. Cloned rules files to project subdirectories and added instructions header in frontend `README.md` to force any active AI agent (including Cursor, Windsurf, Copilot, Cline, etc.) to read the project `docs/` files first, update `memory.md` on task completion, and refrain from running database migrations.

### 2026-07-15: Replaced browser delete confirm with app-confirm-dialog
- **Files changed:** `src/app/erp/domains/transport/pages/bus-list/bus-list.component.ts`, `src/app/erp/domains/transport/pages/bus-list/bus-list.component.html`.
- **Changes made:** Imported `ConfirmDialogComponent` and replaced native JS `confirm(...)` browser dialog with the shared `app-confirm-dialog` popup when deleting bus routes.

### 2026-07-15: Added Transport Destinations and Metrics
- **Files changed:** `src/app/erp/domains/transport/pages/bus-list/bus-list.component.ts`, `src/app/erp/domains/transport/pages/bus-list/bus-list.component.html`.
- **Changes made:** Added `startDestination` and `endDestination` form variables to the bus forms. Expanded the main directory grid with destinations route labels, seats occupied load counters, and pending requests indicators.

### 2026-07-14: Implemented Transport Domain & Fleet Management Workspace
- **Files added:** `src/app/erp/domains/transport/` (http service, signals store, bus list pages, bus detail pages, route layout configs).
- **Files changed:** `src/app/erp/core/api/constants/api.constants.ts`, `src/app/erp/core/permissions/constants/permission.constants.ts`, `src/app/erp/core/permissions/models/permission.model.ts`, `src/app/erp/routes/erp.routes.ts`, `src/app/erp/layout/components/sidebar/sidebar.config.ts`, `src/app/erp/domains/students/pages/student-create-edit/student-create-edit.component.ts`.
- **Changes made:** Constructed a full-featured Transport UI showing bus routes list, driver details, and student assignments. Configured navigation flow: clicking a bus row redirects to a dedicated details page displaying bus stats (utilization progress bar) and the passenger table log below.

### 2026-07-14: Updated Toast notifications for Auto-Generated Credentials
- **File changed:** `src/app/erp/domains/admissions/pages/admit-student/admit-student.component.ts`
- **File changed:** `src/app/erp/domains/teachers/pages/teacher-list/teacher-list.component.ts`
- **Changes made:** Handled `studentAccount` and `teacherAccount` properties inside creation request success subscriptions. If `isDummy === true`, a PrimeNG Toast is launched (severity `info`, duration `10000ms`) showing the autogenerated email, enabling the administrator to write it down.

### 2026-07-08: Resolved Translation Library Crash & Config Missing Assets
- **File changed:** `src/app.component.ts`
- **File changed:** `angular.json`
- **Changes made:** Fixed translation loader initialization crash by updating `ngx-translate` method invocation from `setDefaultLang` to `setFallbackLang`. Included `src/assets/i18n` path in the `angular.json` build assets configurations so compilation copies the localization JSON outputs.

### 2026-07-07: Fixed Staff Attendance Status Mapping
- **File changed:** `src/app/erp/domains/attendance/services/attendance.service.ts`
- **Changes made:** Fixed Roster mapper using `teacherId` property lookup key instead of `studentId` inside staff attendance methods, correcting statuses display values.
