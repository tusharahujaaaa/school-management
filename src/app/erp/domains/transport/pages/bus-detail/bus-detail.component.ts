import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TransportStore } from '../../store/transport.store';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-bus-detail',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    ProgressBarModule
  ],
  templateUrl: './bus-detail.component.html'
})
export class BusDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected transportStore = inject(TransportStore);

  busId = signal<string | null>(null);

  // Compute capacity utilization percentage
  utilizationPercentage = computed(() => {
    const bus = this.transportStore.selectedBus();
    const passengers = this.transportStore.assignments();
    if (!bus || !bus.capacity) return 0;
    return Math.min(Math.round((passengers.length / bus.capacity) * 100), 100);
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.busId.set(id);
      this.transportStore.loadBuses(); // Ensure buses list is loaded
      this.transportStore.selectBus(id);
    } else {
      this.router.navigate(['/erp/transport']);
    }
  }

  goBack() {
    this.router.navigate(['/erp/transport']);
  }
}
