import { Injectable, signal, computed, inject } from '@angular/core';
import { TransportHttpService } from '../services/transport-http.service';
import { finalize, Observable, tap } from 'rxjs';
import { ApiResponse } from '../../../core/api/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class TransportStore {
  private transportHttp = inject(TransportHttpService);

  // State
  private _buses = signal<any[]>([]);
  private _loading = signal<boolean>(false);
  private _selectedBusId = signal<string | null>(null);
  private _assignments = signal<any[]>([]);

  // Selectors
  readonly buses = this._buses.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly selectedBusId = this._selectedBusId.asReadonly();
  readonly assignments = this._assignments.asReadonly();

  readonly selectedBus = computed(() => {
    const id = this._selectedBusId();
    if (!id) return null;
    return this._buses().find(b => b.id === id) || null;
  });

  // Actions
  loadBuses() {
    this._loading.set(true);
    this.transportHttp.getBuses()
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.success && Array.isArray(res.data)) {
            this._buses.set(res.data);
          }
        },
        error: (err) => console.error('Error fetching buses:', err)
      });
  }

  selectBus(id: string | null) {
    this._selectedBusId.set(id);
    if (id) {
      this.loadAssignments(id);
    } else {
      this._assignments.set([]);
    }
  }

  loadAssignments(busId: string) {
    this.transportHttp.getBusAssignments(busId).subscribe({
      next: (res) => {
        if (res?.success && Array.isArray(res.data)) {
          this._assignments.set(res.data);
        }
      },
      error: (err) => console.error('Error loading bus assignments:', err)
    });
  }

  createBus(data: any): Observable<ApiResponse<any>> {
    this._loading.set(true);
    return this.transportHttp.createBus(data).pipe(
      tap((res) => {
        if (res?.success && res.data) {
          this._buses.update(buses => [...buses, res.data]);
        }
      }),
      finalize(() => this._loading.set(false))
    );
  }

  updateBus(id: string, data: any): Observable<ApiResponse<any>> {
    this._loading.set(true);
    return this.transportHttp.updateBus(id, data).pipe(
      tap((res) => {
        if (res?.success && res.data) {
          this._buses.update(buses => 
            buses.map(b => b.id === id ? res.data : b)
          );
        }
      }),
      finalize(() => this._loading.set(false))
    );
  }

  deleteBus(id: string): Observable<ApiResponse<any>> {
    this._loading.set(true);
    return this.transportHttp.deleteBus(id).pipe(
      tap((res) => {
        if (res?.success) {
          this._buses.update(buses => buses.filter(b => b.id !== id));
          if (this._selectedBusId() === id) {
            this._selectedBusId.set(null);
            this._assignments.set([]);
          }
        }
      }),
      finalize(() => this._loading.set(false))
    );
  }
}
