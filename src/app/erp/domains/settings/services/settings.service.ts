import { Injectable, signal, inject } from '@angular/core';
import { SettingsHttpService } from './settings-http.service';
import { catchError, of, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private httpSvc = inject(SettingsHttpService);

  readonly loading = signal<boolean>(false);
  readonly saving = signal<boolean>(false);
  readonly config = signal<any | null>(null);

  /**
   * Load active school website configuration
   */
  loadConfig() {
    this.loading.set(true);
    this.httpSvc.getWebsiteConfig().pipe(
      catchError((err) => {
        console.error('Error loading website configuration:', err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe((res: any) => {
      if (res?.success && res.data) {
        this.config.set(res.data);
      } else {
        this.config.set(null);
      }
    });
  }

  /**
   * Save/update school website configuration
   */
  saveConfig(data: any) {
    this.saving.set(true);
    return this.httpSvc.saveWebsiteConfig(data).pipe(
      finalize(() => this.saving.set(false))
    );
  }
}
