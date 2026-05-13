import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ERP_BRANDING_CONFIG } from '../../../config/branding.config';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { PasswordModule } from 'primeng/password';
import { AppFloatingConfigurator } from '../../../../layout/component/app.floatingconfigurator';
import { ProgressBarModule } from 'primeng/progressbar';
@Component({
  selector: 'app-erp-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, InputTextModule, ButtonModule, CheckboxModule, RippleModule, AppFloatingConfigurator, PasswordModule, ProgressBarModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  branding = ERP_BRANDING_CONFIG;
  email: string = '';

  password: string = '';

  checked: boolean = false;
  rememberMe: boolean = false;

  private authService = inject(AuthService);

  login() {
    this.authService.login();
  }
}
