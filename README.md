# Campus Handle SMS Frontend

> [!IMPORTANT]
> **DEVELOPERS & AI ASSISTANTS:** You **MUST** read and follow **ALL** files in the [docs/](file:///d:/wall/SMS/sakai-ng/docs) directory before modifying any code. Pay close attention to [rules.md](file:///d:/wall/SMS/sakai-ng/docs/rules.md) and [memory.md](file:///d:/wall/SMS/sakai-ng/docs/memory.md) (which must be updated on task completion).

Frontend ERP application for **Campus Handle SMS**, an enterprise school management SaaS platform.

This project is built with **Angular 21**, **PrimeNG 21**, Angular Signals, and zoneless change detection. It connects to the `campus-handle-api` backend through the configured `/api/v1` API base URL.

## Tech Stack

| Technology | Usage |
| --- | --- |
| Angular 21 | Application framework |
| PrimeNG 21 | UI component library |
| PrimeFlex / PrimeIcons | Layout utilities and icons |
| Tailwind CSS 4 | Utility styling pipeline |
| RxJS | Async data flows |
| Angular Signals | Local reactive state |
| Angular zoneless change detection | Runtime change detection mode |

## Application Structure

```text
src/
├── app.routes.ts                  # Root routes
├── app.config.ts                  # App providers, router, HTTP interceptors, PrimeNG
├── environments/                  # API environment config
└── app/erp/
    ├── core/                      # API base service, interceptors, permissions
    ├── domains/                   # ERP feature modules
    ├── layout/                    # Auth and dashboard layouts
    ├── pages/                     # Shared top-level pages
    └── shared/                    # Reusable UI, forms, and types
```

## Integrated Modules

| Module | Frontend Route | Backend API |
| --- | --- | --- |
| Authentication | `/erp/login` | `/auth` |
| Dashboard | `/erp/dashboard` | `/dashboard` |
| Students | `/erp/students` | `/students` |
| Attendance | `/erp/attendance` | `/attendance` |
| Fees | `/erp/fees` | `/fees` |
| Admissions | `/erp/admissions` | `/admissions` |
| Public Admission Inquiry | `/admission-inquiry`, `/admission-inquiry/:domain` | `/admissions/submit`, `/website/public/:domain` |
| Teachers | `/erp/teachers` | `/teachers` |
| Academics | `/erp/academics` | `/classes`, `/fees/sessions` |
| Settings / Website Config | `/erp/settings` | `/website` |

## API Configuration

The API base URL is configured through Angular environment files:

| File | API URL |
| --- | --- |
| `src/environments/environment.development.ts` | `http://localhost:3000/api/v1` |
| `src/environments/environment.ts` | `https://campus-handle-api.onrender.com/api/v1` |

The shared API layer lives under `src/app/erp/core/api/` and includes:

- `BaseApiService` for common HTTP methods.
- `authInterceptor` for Bearer token injection and silent refresh handling.
- `loadingInterceptor` for request loading state.
- `errorInterceptor` for global API error handling.

## Authentication

- Access tokens are stored in memory.
- Refresh tokens and temporary user/session state are stored in `sessionStorage`.
- Token refresh is performed through `POST /auth/refresh`.
- User details are synchronized through `GET /auth/me`.
- Protected ERP routes use `authGuard` and module-level `permissionGuard`.

## Getting Started

### Prerequisites

- Node.js 18 or newer.
- npm.
- Angular CLI 21 if running Angular commands globally.
- Running backend API from `../campus-handle-api` for local development.

### Install

```bash
npm install
```

### Run Locally

```bash
npm start
```

The development server runs on:

```text
http://localhost:4300/
```

The root route redirects to `/erp`, then to `/erp/login` when unauthenticated.

## Available Scripts

| Script | Command | Description |
| --- | --- | --- |
| `start` | `ng serve --port 4300 -o` | Start the local dev server |
| `build` | `ng build` | Build the application |
| `watch` | `ng build --watch --configuration development` | Rebuild on changes |
| `format` | `prettier --write "**/*.{js,mjs,ts,mts,d.ts,html}" --cache` | Format supported files |
| `test` | `ng test` | Run Angular unit tests |

## Verification

Run a TypeScript compilation audit before shipping changes:

```bash
npx tsc --noEmit
```

Run a production build check when changing routing, environments, or shared providers:

```bash
npm run build
```

## Coordination Docs

Workspace-level project tracking files live under `../doc/`:

- `../doc/frontend_integration_tracker.md`
- `../doc/backend_gaps_track.md`

Use these files to understand recent frontend integration work and known backend API gaps.
