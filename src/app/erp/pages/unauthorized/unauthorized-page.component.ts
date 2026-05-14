import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  template: `
    <div class="flex flex-column align-items-center justify-content-center min-h-screen p-4 text-center">
      <div class="surface-card p-8 shadow-2 border-round-xl max-w-lg">
        <div class="flex align-items-center justify-content-center bg-red-100 border-circle mb-4 mx-auto" style="width: 6rem; height: 6rem">
          <i class="pi pi-lock text-5xl text-red-600"></i>
        </div>
        
        <h1 class="text-4xl font-bold text-900 mb-2">Access Denied</h1>
        <p class="text-600 text-lg mb-6 line-height-3">
          You do not have the required permissions to access this page. 
          Please contact your administrator if you believe this is an error.
        </p>
        
        <div class="flex flex-column sm:flex-row gap-3 justify-content-center">
          <button pButton label="Go to Dashboard" icon="pi pi-home" routerLink="/erp/dashboard" class="p-button-lg"></button>
          <button pButton label="Go Back" icon="pi pi-arrow-left" (click)="goBack()" class="p-button-lg p-button-outlined p-button-secondary"></button>
        </div>
      </div>
    </div>
  `
})
export class UnauthorizedPageComponent {
  goBack() {
    window.history.back();
  }
}
