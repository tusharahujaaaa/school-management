import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  /**
   * Global loading state (true if any request is pending)
   */
  readonly isLoading = signal(false);

  /**
   * Map to track multiple concurrent requests
   */
  private activeRequests = new Map<string, boolean>();

  /**
   * Set loading state for a specific key or globally
   */
  setLoading(isLoading: boolean, url: string = 'global'): void {
    if (isLoading) {
      this.activeRequests.set(url, true);
    } else {
      this.activeRequests.delete(url);
    }

    this.isLoading.set(this.activeRequests.size > 0);
  }

  /**
   * Manually check if a specific URL is loading
   */
  isUrlLoading(url: string): boolean {
    return this.activeRequests.has(url);
  }
}
