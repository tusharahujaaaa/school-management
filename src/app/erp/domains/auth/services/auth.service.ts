import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Temporary state using signals and localStorage
  private readonly AUTH_KEY = 'erp_temp_auth_state';
  isAuthenticated = signal<boolean>(this.checkInitialState());

  constructor(private router: Router) {}

  private checkInitialState(): boolean {
    return localStorage.getItem(this.AUTH_KEY) === 'true';
  }

  login() {
    // In a real app, this would call an API, then set state on success
    localStorage.setItem(this.AUTH_KEY, 'true');
    this.isAuthenticated.set(true);
    this.router.navigate(['/erp/dashboard']);
  }

  logout() {
    // Clear temporary auth state
    localStorage.removeItem(this.AUTH_KEY);
    this.isAuthenticated.set(false);
    this.router.navigate(['/erp/login']);
  }
}
