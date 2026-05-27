import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admission-requests',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-column align-items-center justify-content-center" style="min-height: 60vh;">
      <div class="surface-card shadow-2 border-round-2xl p-6 text-center" style="max-width: 480px; width: 100%;">
        <div class="w-5rem h-5rem border-circle bg-orange-50 flex align-items-center justify-content-center mx-auto mb-4">
          <i class="pi pi-inbox text-orange-500 text-4xl"></i>
        </div>
        <h1 class="text-900 font-bold text-2xl mb-2">Admission Requests</h1>
        <p class="text-500 text-base m-0">
          This screen is under construction. Pending admission requests and approvals will appear here.
        </p>
        <div class="mt-4 px-4 py-2 bg-orange-50 border-round-xl border-1 border-orange-100 inline-flex align-items-center gap-2">
          <i class="pi pi-info-circle text-orange-400 text-sm"></i>
          <span class="text-orange-600 text-sm font-medium">Coming Soon</span>
        </div>
      </div>
    </div>
  `
})
export class AdmissionRequestsComponent {}
