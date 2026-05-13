import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student, AttendanceStatus } from '../../../models/attendance.model';

export interface StudentAttendanceRow {
  student: Student;
  status: AttendanceStatus | null;
}

@Component({
  selector: 'app-attendance-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto" [style.max-height]="maxHeight" style="overflow-y: auto;">
      <table class="w-full" style="border-collapse: collapse;">
        <thead style="position: sticky; top: 0; z-index: 1;">
          <tr class="surface-50">
            <th class="p-3 text-left border-bottom-1 surface-border text-500 font-medium text-sm w-4rem">#</th>
            <th class="p-3 text-left border-bottom-1 surface-border text-500 font-medium text-sm">Student</th>
            <th class="p-3 text-left border-bottom-1 surface-border text-500 font-medium text-sm">Status</th>
            <th *ngIf="editable" class="p-3 text-left border-bottom-1 surface-border text-500 font-medium text-sm">Mark</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of rows" class="hover:surface-50 border-bottom-1 surface-border transition-colors">
            <td class="p-3 text-700 font-mono text-sm">{{ row.student.rollNumber }}</td>
            <td class="p-3">
              <div class="flex align-items-center gap-2">
                <div class="bg-primary-50 text-primary border-circle flex align-items-center justify-content-center font-bold text-xs"
                     style="width:1.75rem;height:1.75rem;flex-shrink:0">
                  {{ row.student.name.charAt(0) }}
                </div>
                <span class="text-900 font-medium text-sm">{{ row.student.name }}</span>
              </div>
            </td>
            <td class="p-3">
              <span *ngIf="row.status" class="inline-flex align-items-center gap-1 px-2 py-1 border-round-xl text-xs font-semibold"
                    [ngClass]="{
                      'bg-green-100 text-green-700': row.status === 'present',
                      'bg-red-100 text-red-700': row.status === 'absent',
                      'bg-orange-100 text-orange-700': row.status === 'late',
                      'bg-blue-100 text-blue-700': row.status === 'leave'
                    }">
                {{ row.status | titlecase }}
              </span>
              <span *ngIf="!row.status" class="text-400 text-xs italic">Not marked</span>
            </td>
            <td *ngIf="editable" class="p-3">
              <div class="flex gap-1 flex-wrap">
                <button *ngFor="let s of statusOptions" (click)="markStatus.emit({ studentId: row.student.id, status: s })"
                  class="border-round px-2 py-1 text-xs font-semibold border-1 cursor-pointer transition-all"
                  [ngClass]="{
                    'bg-green-500 border-green-500 text-white': row.status === s && s === 'present',
                    'bg-red-500 border-red-500 text-white': row.status === s && s === 'absent',
                    'bg-orange-500 border-orange-500 text-white': row.status === s && s === 'late',
                    'bg-blue-500 border-blue-500 text-white': row.status === s && s === 'leave',
                    'surface-0 border-surface-300 text-500 hover:surface-100': row.status !== s
                  }">{{ s | titlecase }}</button>
              </div>
            </td>
          </tr>
          <tr *ngIf="rows.length === 0">
            <td [colSpan]="editable ? 4 : 3" class="p-6 text-center">
              <i class="pi pi-users text-200 text-4xl block mb-3"></i>
              <p class="text-500 m-0 text-sm">No students found.</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class AttendanceTableComponent {
  @Input({ required: true }) rows: StudentAttendanceRow[] = [];
  @Input() editable = false;
  @Input() maxHeight = '500px';

  readonly statusOptions: AttendanceStatus[] = ['present', 'absent', 'late', 'leave'];

  // Output via EventEmitter — avoids circular dependency
  markStatus = { emit: (_: { studentId: string; status: AttendanceStatus }) => {} };
}
