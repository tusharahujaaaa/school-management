import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { AttendanceService } from '../../services/attendance.service';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { ErpTableComponent } from '../../../../shared/ui/tables/erp-table.component';

import { AttendanceHistoryRecord } from '../../models/attendance.model';

@Component({
  selector: 'app-attendance-history',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule, ButtonModule, PageHeaderComponent, ErpTableComponent],
  templateUrl: './attendance-history.component.html',
  styleUrls: ['./attendance-history.component.scss']
})
export class AttendanceHistoryComponent {
  private svc = inject(AttendanceService);

  history = this.svc.history;
  classOptions = [{ label: 'All Classes', value: '' }, ...this.svc.classes().map(c => ({ label: c, value: c }))];
  sectionOptions = [{ label: 'All Sections', value: '' }, ...this.svc.sections().map(s => ({ label: `Section ${s}`, value: s }))];

  filterClass = signal('');
  filterSection = signal('');
  filterDate = signal('');

  get filteredHistory(): AttendanceHistoryRecord[] {
    return this.history().filter(h => {
      const matchClass = !this.filterClass() || h.class === this.filterClass();
      const matchSection = !this.filterSection() || h.section === this.filterSection();
      const matchDate = !this.filterDate() || h.date === this.filterDate();
      return matchClass && matchSection && matchDate;
    });
  }

  tableCols = [
    { field: 'date', header: 'Date', sortable: true },
    { field: 'class', header: 'Class', sortable: true },
    { field: 'section', header: 'Section', sortable: true },
    { field: 'markedBy', header: 'Marked By', sortable: true },
    { field: 'present', header: 'Present', sortable: true },
    { field: 'absent', header: 'Absent', sortable: true },
    { field: 'percentage', header: 'Percentage', sortable: true }
  ];

  getPercentageClass(pct: number): string {
    if (pct >= 90) return 'text-green-600';
    if (pct >= 75) return 'text-orange-500';
    return 'text-red-500';
  }

  resetFilters() {
    this.filterClass.set('');
    this.filterSection.set('');
    this.filterDate.set('');
  }
}
