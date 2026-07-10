import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AuthService } from '../services/auth.service';
import { Eye } from '@primeicons/angular/eye';
import { EyeSlash } from '@primeicons/angular/eye-slash';
import { TranslatePipe } from '@ngx-translate/core';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const newPassword = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');

  return newPassword && confirmPassword && newPassword.value !== confirmPassword.value
    ? { mismatch: true }
    : null;
};

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
        CommonModule, RouterModule, ReactiveFormsModule, InputTextModule, ButtonModule, ProgressBarModule, ToastModule, PasswordModule, IconFieldModule, InputIconModule, Eye, EyeSlash, TranslatePipe
    ],
  providers: [MessageService],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  loading = signal(false);
  completed = signal(false);
  mask = signal(true);

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private resetToken = '';

  resetForm = this.fb.nonNullable.group({
    newPassword: ['', [Validators.required, Validators.minLength(5)]],
    confirmPassword: ['', Validators.required],
  }, { validators: passwordMatchValidator });

  ngOnInit() {
    this.resetToken = this.route.snapshot.queryParamMap.get('token') || '';
  }

  toggleMask() {
    this.mask.set(!this.mask());
  }

  submitReset() {
    console.log('Submitting reset with token:', this.resetForm.value);
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Form Invalid',
        detail: 'Please complete all required fields.',
        life: 6000,
      });
      return;
    }

    if (!this.resetToken) {
      this.messageService.add({
        severity: 'error',
        summary: 'Missing Token',
        detail: 'Invalid or missing reset token.',
        life: 6000,
      });
      return;
    }

    const { newPassword, confirmPassword } = this.resetForm.getRawValue();
    if (newPassword !== confirmPassword) {
      this.resetForm.controls.confirmPassword.setErrors({ mismatch: true });
      this.messageService.add({
        severity: 'error',
        summary: 'Password Mismatch',
        detail: 'New password and confirmation password must match.',
        life: 6000,
      });
      return;
    }

    this.loading.set(true);
    this.authService.resetPassword(this.resetToken, newPassword, confirmPassword).subscribe({
      next: (res: any) => {
        const message = res?.message || 'Password reset successfully.';
        this.loading.set(false);
        this.completed.set(true);
        this.messageService.add({
          severity: 'success',
          summary: 'Password Reset',
          detail: message,
          life: 8000,
        });
      },
      error: (err: any) => {
        const msg = err?.error?.message || err?.message || 'Unable to reset password.';
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Reset Failed',
          detail: msg,
          life: 8000,
        });
      },
    });
  }

  goToLogin() {
    this.router.navigate(['/erp/login']);
  }
}
