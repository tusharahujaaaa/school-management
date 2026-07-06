import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ERP_BRANDING_CONFIG } from '../../../config/branding.config';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { PasswordModule } from 'primeng/password';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Eye } from '@primeicons/angular/eye';
import { EyeSlash } from '@primeicons/angular/eye-slash';
@Component({
  selector: 'app-erp-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, InputTextModule, ButtonModule, CheckboxModule, RippleModule, PasswordModule, ProgressBarModule, ToastModule, IconFieldModule, InputIconModule, Eye, EyeSlash],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  branding = ERP_BRANDING_CONFIG;
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  mask = signal<boolean>(true);
  

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage.set('Please fix the errors in the form before signing in.');
      this.messageService.add({
        severity: 'error',
        summary: 'Form Invalid',
        detail: 'Please enter a valid email and password (min 6 characters).',
        life: 8000
      });
      return;
    }

    const { email, password } = this.loginForm.getRawValue();

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.login(email, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/erp/dashboard']);
      },
      error: (err: any) => {
        this.loading.set(false);
        const msg = err?.error?.message || err?.message || 'Invalid email or password.';
        this.errorMessage.set(msg);
        this.messageService.add({
          severity: 'error',
          summary: 'Sign In Failed',
          detail: msg,
          life: 8000
        });
      }
    });
  }

  toggleMask() {
    this.mask.update(m => !m);
  }
}
