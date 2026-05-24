import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-erp-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, InputTextModule, ButtonModule, CheckboxModule, RippleModule, PasswordModule, ProgressBarModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  branding = ERP_BRANDING_CONFIG;
  loading: boolean = false;
  errorMessage: string = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Please fix the errors in the form before signing in.';
      return;
    }

    const { email, password } = this.loginForm.getRawValue();

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/erp/dashboard']);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || err?.message || 'Invalid email or password.';
      }
    });
  }
}
