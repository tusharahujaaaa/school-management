import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../services/auth.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
        CommonModule, RouterModule, ReactiveFormsModule, InputTextModule, ButtonModule, ProgressBarModule, ToastModule, TranslatePipe
    ],
  providers: [MessageService],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  loading = signal(false);

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  resetRequestForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  requestReset() {
    if (this.resetRequestForm.invalid) {
      this.resetRequestForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Email',
        detail: 'Please enter a valid email address.',
        life: 6000,
      });
      return;
    }

    const { email } = this.resetRequestForm.getRawValue();
    this.loading.set(true);

    this.authService.forgotPassword(email).subscribe({
      next: (res: any) => {
        this.loading.set(false);
        const resetToken = res?.data?.resetToken;
        
        if (resetToken) {
          this.router.navigate(['/erp/reset-password'], { queryParams: { token: resetToken } });
        } else {
           // Fallback in case backend doesn't return the token.
           this.messageService.add({
             severity: 'success',
             summary: 'Request Sent',
             detail: 'Password reset instructions prepared.',
             life: 8000,
           });
        }
      },
      error: (err: any) => {
        const msg = err?.error?.message || err?.message || 'Unable to request password reset.';
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Request Failed',
          detail: msg,
          life: 8000,
        });
      },
    });
  }
}
