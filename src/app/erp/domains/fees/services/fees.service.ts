import { Injectable, signal, inject } from '@angular/core';
import { FeesHttpService } from './fees-http.service';
import { catchError, of, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeesService {
  private httpSvc = inject(FeesHttpService);

  // Writable Signals for State Management
  readonly loading = signal<boolean>(false);
  
  // Dashboard states
  readonly totalCollected = signal<number>(0);
  readonly pendingDues = signal<number>(0);
  readonly overdueFees = signal<number>(0);
  readonly recentPayments = signal<any[]>([]);

  // Sessions states
  readonly sessions = signal<any[]>([]);
  readonly activeSession = signal<any>(null);

  // Structure states
  readonly feeStructures = signal<any[]>([]);

  // Record list states (paginated)
  readonly feeRecords = signal<any[]>([]);
  readonly totalRecords = signal<number>(0);
  readonly currentPage = signal<number>(1);
  readonly totalPages = signal<number>(1);
  readonly recordsLimit = signal<number>(10);

  // Active filters
  readonly filterStudentId = signal<string>('');
  readonly filterStatus = signal<string>('');
  readonly filterFeeType = signal<string>('');
  readonly filterMonth = signal<string>('');
  readonly filterSearch = signal<string>('');
  readonly filterClassId = signal<string>('');

  /**
   * Initialise & load aggregate dashboard figures
   */
  loadDashboardData() {
    this.loading.set(true);
    this.httpSvc.getFeeDashboard().pipe(
      catchError((err) => {
        console.error('Error fetching fee dashboard stats:', err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe((res: any) => {
      if (res?.success && res.data) {
        const d = res.data;
        this.totalCollected.set(d.totalPaid?.amount || 0);
        this.pendingDues.set(d.totalPending?.amount || 0);
        this.overdueFees.set(d.totalOverdue?.amount || 0);
        this.recentPayments.set(d.recentPayments || []);
      }
    });
  }

  /**
   * Load active fee structures list
   */
  loadFeeStructures() {
    this.loading.set(true);
    this.httpSvc.getFeeStructures().pipe(
      catchError((err) => {
        console.error('Error fetching fee structures:', err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe((res: any) => {
      if (res?.success && res.data) {
        this.feeStructures.set(res.data);
      }
    });
  }

  /**
   * Load active session years list
   */
  loadSessions() {
    this.loading.set(true);
    this.httpSvc.getSessions().pipe(
      catchError((err) => {
        console.error('Error fetching sessions:', err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe((res: any) => {
      if (res?.success && Array.isArray(res.data)) {
        this.sessions.set(res.data);
        const active = res.data.find((s: any) => s.isActive);
        this.activeSession.set(active || null);
      }
    });
  }

  /**
   * Retrieve filtered paginated transaction logs
   */
  loadFeeRecords(page = 1) {
    this.loading.set(true);
    this.currentPage.set(page);

    const filters = {
      page: this.currentPage(),
      limit: this.recordsLimit(),
      studentId: this.filterStudentId() || undefined,
      status: this.filterStatus() || undefined,
      feeType: this.filterFeeType() || undefined,
      month: this.filterMonth() || undefined,
      search: this.filterSearch() || undefined,
      classId: this.filterClassId() || undefined,
      sessionId: this.activeSession()?.id || undefined
    };

    this.httpSvc.getFeeRecords(filters).pipe(
      catchError((err) => {
        console.error('Error loading transaction records list:', err);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe((res: any) => {
      if (res?.success && res.data) {
        const payload = res.data;
        this.feeRecords.set(payload.data || []);
        this.totalRecords.set(payload.total || 0);
        this.totalPages.set(payload.totalPages || 1);
      } else {
        this.feeRecords.set([]);
        this.totalRecords.set(0);
        this.totalPages.set(1);
      }
    });
  }

  /**
   * Trigger manual payment recording
   */
  collectPayment(recordId: string, paymentDetails: { paymentMode: string; paidDate: string; remarks?: string }) {
    this.loading.set(true);
    return this.httpSvc.payFeeRecord(recordId, paymentDetails).pipe(
      finalize(() => this.loading.set(false))
    );
  }

  /**
   * Register a new fee structure configuration template
   */
  createStructure(data: { classId?: string; feeType: string; label: string; amount: number; frequency: string; dueDay?: number; sessionId?: string }) {
    this.loading.set(true);
    return this.httpSvc.createFeeStructure(data).pipe(
      finalize(() => this.loading.set(false))
    );
  }

  /**
   * Delete a fee structure template
   */
  deleteStructure(structureId: string) {
    this.loading.set(true);
    return this.httpSvc.deleteFeeStructure(structureId).pipe(
      finalize(() => this.loading.set(false))
    );
  }

  /**
   * Perform invoice generation action
   */
  runInvoiceGeneration(payload: { sessionId: string; classId?: string; feeType: string; month: number; year: number }) {
    this.loading.set(true);
    return this.httpSvc.generateInvoices(payload).pipe(
      finalize(() => this.loading.set(false))
    );
  }

  /**
   * Waive a fee record
   */
  waiveRecord(recordId: string, remarks?: string) {
    this.loading.set(true);
    return this.httpSvc.waiveFeeRecord(recordId, remarks).pipe(
      finalize(() => this.loading.set(false))
    );
  }
}

