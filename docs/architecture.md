# Sakai NG Frontend Architecture & System Flow

This document details the frontend directory organization, technology choices, routing pipelines, and state management patterns.

---

## 1. Directory Structure Details

The frontend follows a **Domain-Driven Modular Design** within the `src/app` directory. This isolates feature domains, making the project highly scalable and easy for teams to maintain without code conflicts.

```
sakai-ng/
├── docs/                               # Project requirements, rules, and design guidelines
├── public/                             # Static templates and favicons
└── src/
    ├── app/
    │   ├── erp/
    │   │   ├── config/                 # Configurations
    │   │   │   └── sidebar.config.ts   # Navigation link structure mapped by roles
    │   │   ├── core/                   # Core application features (singleton services)
    │   │   │   ├── guards/             # Route authentication guards
    │   │   │   └── interceptors/       # HTTP header tokens modifiers
    │   │   ├── domains/                # Feature domains (business logic blocks)
    │   │   │   ├── academics/          # Classes, sessions, subjects management
    │   │   │   ├── admissions/         # Leads, registration forms
    │   │   │   │   └── pages/
    │   │   │   │       └── admit-student/
    │   │   │   │           ├── admit-student.component.ts   # Admissions logic
    │   │   │   │           └── admit-student.component.html # Admissions UI template
    │   │   │   ├── attendance/         # Student and staff attendance grids
    │   │   │   ├── auth/               # Access validation layouts
    │   │   │   ├── dashboard/          # Performance metrics overview charts
    │   │   │   ├── exams/              # Scheduling, marks entry spreadsheets
    │   │   │   ├── fees/               # Billing registers and overdue tracking
    │   │   │   ├── settings/           # School properties config panels
    │   │   │   ├── students/           # Profiles directories
    │   │   │   │   ├── services/
    │   │   │   │   │   └── student.service.ts # Student HTTP service
    │   │   │   │   └── store/
    │   │   │   │       └── student.store.ts   # Student Signals Store
    │   │   │   └── teachers/           # Staff rosters
    │   │   ├── layout/                 # Shared workspace frames
    │   │   │   ├── app.menu.component.ts # Dynamically renders sidebar menu
    │   │   │   └── app.topbar.component.ts # Profile controls & header options
    │   │   ├── pages/                  # Root workspace components
    │   │   ├── routes/                 # Main workspace navigation paths
    │   │   ├── shared/                 # Reusable UI widgets
    │   │   │   └── components/         # Shared form fields, inputs, drop-downs
    │   │   └── theme/                  # Global CSS theme variables
    │   ├── app.component.ts            # Bootstraps core modules
    │   ├── app.config.ts               # Core app provider configurations
    │   └── app.routes.ts               # Base redirect tree
    ├── assets/                         # Localization dictionaries (i18n en.json)
    ├── environments/                   # Server endpoints paths
    └── main.ts                         # App boots entry point
```

---

## 2. Technical Stack Justification

### 2.1 Framework: Angular 21
* **Why Standalone Components?** Standalone components eliminate the overhead of traditional `NgModule` declarations. This speeds up lazy-loading compilation and helps isolate code for cleaner testing.
* **Why the inject() function?** Moving from constructor-based injection to the `inject()` token function keeps component classes cleaner and resolves token lookup issues when using inheritance.

### 2.2 UI Kit: PrimeNG 21
* PrimeNG provides pre-built, accessible UI components (such as data tables, calendars, dialog popups, and dropdown menus). This allows developers to focus on core business logic rather than writing basic UI controls from scratch.

### 2.3 Style System: TailwindCSS v4 & PrimeFlex v4
* **TailwindCSS v4:** Handles layouts, utility classes, and custom modifiers.
* **PrimeFlex v4:** Used for forms layouts and component grids.
* **Unified Themes:** Shared CSS variables link Tailwind utility colors with PrimeNG components, ensuring styling remains consistent across light and dark modes.

---

## 3. Core Application Flows

### 3.1 Application Bootstrap Flow
```
main.ts (App Entry)
   │
   ▼
app.config.ts (Provider Registrations)
   ├── ProvideHttpClient() with interceptors
   ├── ProvideRouter() with app.routes.ts
   └── ProvideTranslate() setting up en.json translations
   │
   ▼
app.component.ts (Root Component)
   └── Initializes TranslateService fallback language (setFallbackLang('en'))
```

### 3.2 Routing & Authentication Guard Flow
1. **User requests path** `/erp/students`.
2. **Router checks route configuration** (`erp.routes.ts`) and triggers mapped Guards (e.g. `AuthGuard`).
3. **AuthGuard checks JWT availability:**
   * **Token missing or expired:** Redirects to `/login`.
   * **Token valid:** Passes request to `AuthInterceptor`.
4. **AuthInterceptor** appends `Authorization: Bearer <token>` to the HTTP headers of the outbound request.

### 3.3 State Management & Data Binding Flow
We use **Angular Signals Stores** for application state management to keep the UI reactive and fast:

```
                  ┌──────────────────────┐
                  │    User Interaction  │
                  └──────────┬───────────┘
                             │ (Submit Form)
                             ▼
                  ┌──────────────────────┐
                  │    Signals Store     │
                  └──────────┬───────────┘
                             │ (Calls API)
                             ▼
                  ┌──────────────────────┐
                  │     HTTP Service     │
                  └──────────┬───────────┘
                             │ (REST Request)
                             ▼
                  ┌──────────────────────┐
                  │      Backend API     │
                  └──────────────────────┘
                             │
                             ▼ (Sends Response JSON)
                  ┌──────────────────────┐
                  │    Signals Store     │
                  └──────────┬───────────┘
                             │ (Updates Signal State)
                             ▼
                  ┌──────────────────────┐
                  │  Component Template  │
                  └──────────────────────┘
```
1. **User interaction:** A user submits the Student Admission form.
2. **Component action:** The component extracts form values and calls `Store.createStudent(payload)`.
3. **Store update:** The Store marks state variables as loading (`isLoading.set(true)`) and calls the `StudentService.createStudent(payload)` API method.
4. **HTTP communication:** The Service executes the HTTP POST request to `/api/students` and returns an RxJS Observable.
5. **State mutation:** The Store subscribes to the request, updates its inner Signals arrays on success, and triggers a Toast notification.
6. **UI re-render:** Because the template is bound directly to the Store's Signals, the UI automatically updates to reflect the new student without a page refresh.
