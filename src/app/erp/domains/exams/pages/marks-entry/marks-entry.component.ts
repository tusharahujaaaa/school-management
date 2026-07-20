import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { splitCSVLine } from '../../../../shared/utils/csv.utils';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-marks-entry',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    ButtonModule,
    TableModule,
    ToastModule,
    InputTextModule,
    TooltipModule,
    RouterModule
  ],
  providers: [MessageService],
  templateUrl: './marks-entry.component.html'
})
export class MarksEntryComponent implements OnInit {
  protected readonly Number = Number;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private examService = inject(ExamService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  examSubjectId = signal<string>('');
  examSubject = signal<any>(null);
  roster = signal<any[]>([]);
  loading = signal<boolean>(false);
  maxMarks = signal<number>(100);

  ngOnInit() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      if (params['id']) {
        this.examSubjectId.set(params['id']);
        this.loadRoster();
      }
    });
  }

  loadRoster() {
    this.loading.set(true);
    this.examService.getRosterForMarksEntry(this.examSubjectId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          if (res.success) {
            this.examSubject.set(res.data.examSubject);
            this.maxMarks.set(Number(res.data.examSubject.maxMarks) || 100);
            this.roster.set(res.data.roster || []);
          }
        },
        error: () => this.loading.set(false)
      });
  }

  // Real-time calculated grade / percentage helper
  calculateGrade(marks: number | null, grace: number): { percent: number; grade: string } {
    if (marks === null || marks === undefined) return { percent: 0, grade: 'N/A' };
    const score = Number(marks) + Number(grace);
    const percent = Math.min(100, Math.round((score / this.maxMarks()) * 100));
    
    // Quick client-side preview estimate matching standard rules
    let grade = 'F';
    if (percent >= 90) grade = 'A+';
    else if (percent >= 80) grade = 'A';
    else if (percent >= 70) grade = 'B';
    else if (percent >= 60) grade = 'C';
    else if (percent >= 40) grade = 'D';
    
    return { percent, grade };
  }

  validateMarks(row: any): boolean {
    if (row.marksObtained !== null && row.marksObtained !== undefined) {
      return Number(row.marksObtained) + Number(row.graceMarks) <= this.maxMarks();
    }
    return true;
  }

  saveMarks() {
    // Validate all rows
    for (const row of this.roster()) {
      if (!this.validateMarks(row)) {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Validation Error', 
          detail: `Marks for ${row.studentName} exceed Max Marks (${this.maxMarks()})` 
        });
        return;
      }
    }

    this.loading.set(true);
    this.examService.bulkSaveExamResults(this.examSubjectId(), this.roster())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.loading.set(false);
          if (res.success) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message || 'Marks saved.' });
            this.loadRoster();
          }
        },
        error: (err: any) => {
          this.loading.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.error?.message || 'Unable to save marks. Please try again.'
          });
        }
      });
  }

  // Client-Side CSV Export (Excel Sheet Compatibility)
  exportToCSV() {
    let csv = 'Roll Number,Student Name,Marks Obtained,Grace Marks,Remarks\n';
    this.roster().forEach(r => {
      csv += `"${r.rollNumber || ''}","${r.studentName || ''}","${r.marksObtained ?? ''}","${r.graceMarks ?? 0}","${r.teacherRemarks || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Marks_Sheet_${this.examSubject()?.subject?.name || 'Subject'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Client-Side CSV Bulk Import
  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      this.parseCSV(text);
    };
    reader.readAsText(file);
  }

  parseCSV(text: string) {
    const lines = text.split('\n');
    let importedCount = 0;

    // Skip headers (index 0)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = splitCSVLine(line);
      if (cols.length < 3) continue;

      const rollNumber = cols[0];
      const marks = cols[2] !== '' ? Number(cols[2]) : null;
      const grace = cols[3] !== '' ? Number(cols[3]) : 0;
      const remarks = cols[4] || '';

      // Match student by Roll Number in roster
      const matchingRow = this.roster().find(r => r.rollNumber === rollNumber);
      if (matchingRow) {
        matchingRow.marksObtained = marks;
        matchingRow.graceMarks = grace;
        matchingRow.teacherRemarks = remarks;
        importedCount++;
      }
    }

    this.messageService.add({ 
      severity: 'success', 
      summary: 'Import Complete', 
      detail: `Successfully imported ${importedCount} student records from CSV.` 
    });
  }
}
