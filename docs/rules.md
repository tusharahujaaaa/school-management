# Sakai NG Frontend Development Rules & Standards

This document establishes the official coding standards, syntax rules, file layouts, and testing expectations for the frontend codebase.

---

## 1. Syntax & Coding Style

### 1.1 Architecture & Components
* **Standalone First:** All new components, directives, and pipes must be declared as standalone:
  ```typescript
  @Component({
    selector: 'app-custom-widget',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    templateUrl: './custom-widget.component.html'
  })
  export class CustomWidgetComponent {}
  ```
* **Inject Pattern:** Use the `inject()` utility at the class level instead of traditional constructor-based dependency injection:
  ```typescript
  // Recommended
  private fb = inject(FormBuilder);
  private studentSvc = inject(StudentService);
  ```
* **Control Flow Syntax:** Strictly use `@if`, `@else if`, `@else`, `@for`, and `@switch` blocks in HTML templates. Do not import `CommonModule` just to use legacy `*ngIf` or `*ngFor` directives.
* **TrackBy in Loops:** When rendering lists with `@for`, always provide a tracking key (like `track student.id`) to ensure optimal rendering performance.

### 1.2 State Management & Signals
* **View State:** Use Angular Signals (`signal()`, `computed()`, `effect()`) for component and view state management.
* **Store Pattern:** Shared or global states must be housed in a Signal Store (e.g. `student.store.ts`). Avoid using local state variables if the data needs to be shared across pages.
* **Signal mutation:** Avoid writing to signals directly inside templates. Instead, wrap mutations inside clear methods within the component class:
  ```typescript
  // In Component
  updateSearch(query: string) {
    this.searchQuery.set(query);
  }
  ```

---

## 2. Formatting & Linting Configuration
* **Code Formatting:** The codebase uses **Prettier** for formatting. Run `npm run format` to automatically format files.
* **File Naming Rules:**
  * Component class files: `name.component.ts`
  * Layout templates: `name.component.html`
  * Domain services: `name.service.ts`
  * State store files: `name.store.ts`
* **Imports order:** Import Angular packages first, followed by third-party libraries (like PrimeNG), and then local absolute imports using path aliases:
  ```typescript
  import { Component, inject } from '@angular/core';
  import { ButtonModule } from 'primeng/button';
  import { StudentService } from '@/app/erp/domains/students/services/student.service';
  ```

---

## 3. Error Handling Standards
* **HTTP Interceptor:** A central `auth.interceptor.ts` intercepts outbound requests to append token headers and handles standard status code responses (like routing to `/login` on a `401 Unauthorized` error).
* **Toast Alerts:** Components must handle API failures by displaying user-friendly error alerts using PrimeNG's `MessageService`:
  ```typescript
  this.studentSvc.createStudent(payload).subscribe({
    next: (res) => { ... },
    error: (err) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Action Failed',
        detail: err?.error?.message || 'A system error occurred.'
      });
    }
  });
  ```
* **Client-Side Form Validation:** Form controls must validate inputs before submission. Display visual error messages beneath inputs:
  ```html
  @if (admitForm.get('parentPhone')?.hasError('pattern') && admitForm.get('parentPhone')?.touched) {
    <small class="p-error">Phone number must be a valid 10-digit number.</small>
  }
  ```

---

## 4. Third-Party Library & AI Boundaries

### 4.1 Dependency Restrictions
* **No Unapproved Packages:** Do not install styling, icons, or state management libraries without explicit authorization. Leverage **TailwindCSS**, **PrimeFlex**, and **PrimeNG** utility suites first.
* **Component isolation:** Keep changes local to the target files to avoid breaking unrelated modules during updates.

### 4.2 Code Preservation
* Do not refactor functional files unless resolving a specific bug or refinement. Maintain all existing file comments and docstrings.
