# 🏫 Campus Handle SMS — Premium school ERP Frontend

Welcome to the premium frontend application for **Campus Handle SMS**, an enterprise-grade School Management System designed for modern educational institutions.

This project is built using **Angular 19** and **PrimeNG**, featuring a reactive, state-of-the-art architecture driven by **Angular Signals** for lightning-fast performance, type safety, and real-time backend synchronization.

---

## 🚀 Key Modules Integrated

### 🔐 1. Core Authentication & Hybrid Security (`/auth`)
* **Secure JWT Management**: Access tokens are kept strictly in-memory (XSS protection) with automatic background token rotation matching the POST `/auth/refresh` endpoint.
* **Anti-Session Overlap**: Sensitive data (refresh tokens, user state) is stored in `sessionStorage` so it automatically discards upon tab closure.
* **Automatic Silent Refresh**: A custom `AuthInterceptor` captures page refreshes and transparently rotates expired tokens without interrupting active user workflows.
* **Superuser Bypass**: Upper-case `'ADMIN'` users automatically bypass sidebar and module restrictions.

### 📊 2. Live Administration Home Dashboard (`/dashboard`)
* **Dynamic Statistics**: ForkJoin-loaded counts reflecting real database records (Total Enrolled Students, active System Staff, Today's Attendance percentage, Outstanding Dues, Active Classes count, and Admissions Leads in the last 30 days).
* **Live Activities Feed**: Displays database updates (like new admissions or inquiries) dynamically formatted with responsive icons and timestamps.

### 🧑‍🎓 3. Student Directory & Profile Management (`/students`)
* **Server-Side Filters**: Advanced search querying, class-specific lookups, and status updates directly bound to backend queries.
* **Dynamic Year Sync**: The academic session calculations default dynamically based on client year and hot-sync with the backend's active setting on resolution.
* **Modular Creation/Edit Forms**: Fully validated, responsive PrimeNG form bindings with complete data-mappers that convert gender/status properties to correct database enums.

### 📝 4. Daily Student Attendance marking (`/attendance`)
* **Dynamic Setup Fetch**: Automatically resolves academic classes and sections from setup APIs.
* **Reactive Effects**: Built with Angular Signals effect loops that dynamically reload student sheets as soon as filters change, eliminating manual click triggers.

---

## 🛠️ Project Coordination & Audit Tracking

Directly in the root of the **`SMS`** workspace, we maintain two live trackers for absolute coordination and compilation safety:

* 📄 **[frontend_integration_tracker.md](../frontend_integration_tracker.md)**: Chronological log of all modified services, files, signal structures, and clean build compile audits.
* 📄 **[backend_gaps_track.md](../backend_gaps_track.md)**: Sync ledger detailing aligned modules and coordinate deficit reports directly with the backend team.

---

## 💻 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.x or above recommended)
* [Angular CLI](https://angular.dev/tools/cli) (v19.x)

### Development Setup
1. Navigate to the frontend directory:
   ```bash
   cd sakai-ng
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```
3. Run the development server locally:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:4200/` to preview the live ERP dashboard!

### Code Compilation Check
Before pushing any modifications, perform a strict type audit to ensure zero runtime regressions:
```bash
npx tsc --noEmit
```

---

## 🎨 Design Guidelines
* **Premium Aesthetics**: Strict adherence to HSL-tailored premium layouts, subtle micro-animations, and dynamic visual hover elements.
* **Robust Form States**: Input validation errors display in a vibrant, glowing red with immediate boundary highlighting.
