import { Injectable, signal, inject } from '@angular/core';
import { AdmissionsHttpService } from './admissions-http.service';
import { catchError, of, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdmissionsService {
  private httpSvc = inject(AdmissionsHttpService);

  // Writable Signals for State Management
  readonly loading = signal<boolean>(false);
  readonly leads = signal<any[]>([]);
  readonly totalLeads = signal<number>(0);
  readonly currentPage = signal<number>(1);
  readonly totalPages = signal<number>(1);
  readonly leadsLimit = signal<number>(10);

  // Active filters
  readonly filterStatus = signal<string>('');
  readonly searchQuery = signal<string>('');

  /**
   * Load paginated inquiries list from backend
   */
  loadLeads(page = 1) {
    this.loading.set(true);
    this.currentPage.set(page);

    const filters = {
      page: this.currentPage(),
      limit: this.leadsLimit(),
      status: this.filterStatus() || undefined,
      search: this.searchQuery() || undefined
    };

    this.httpSvc.getLeads(filters).pipe(
      catchError((err) => {
        console.error('Error loading admission leads list:', err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe((res: any) => {
      if (res?.success && res.data) {
        const payload = res.data;
        this.leads.set(payload.data || []);
        this.totalLeads.set(payload.total || 0);
        this.totalPages.set(payload.totalPages || 1);
      } else {
        this.leads.set([]);
        this.totalLeads.set(0);
        this.totalPages.set(1);
      }
    });
  }

  /**
   * Update lead pipeline status and comments
   */
  updateLead(leadId: string, status: string, notes?: string) {
    this.loading.set(true);
    return this.httpSvc.updateLeadStatus(leadId, { status, notes }).pipe(
      finalize(() => this.loading.set(false))
    );
  }

  /**
   * Submit a public lead inquiry form
   */
  submitLeadInquiry(data: any) {
    this.loading.set(true);
    return this.httpSvc.submitInquiry(data).pipe(
      finalize(() => this.loading.set(false))
    );
  }

  /**
   * Resolve a school ID by domain lookup
   */
  resolveSchoolByDomain(domain: string) {
    return this.httpSvc.getPublicSchoolConfig(domain);
  }
}
