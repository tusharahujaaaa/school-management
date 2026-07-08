import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-report-card',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    ToastModule,
    RouterModule
  ],
  providers: [MessageService],
  templateUrl: './report-card.component.html',
  styles: [`
    @media print {
      .no-print {
        display: none !important;
      }
      .card {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }
    }
  `]
})
export class ReportCardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private examService = inject(ExamService);

  studentId = signal<string>('');
  examId = signal<string>('');
  
  student = signal<any>(null);
  summary = signal<any>(null);
  gradesList = signal<any[]>([]);
  loading = signal<boolean>(false);

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['studentId'] && params['examId']) {
        this.studentId.set(params['studentId']);
        this.examId.set(params['examId']);
        this.loadReportCard();
      }
    });
  }

  loadReportCard() {
    this.loading.set(true);
    this.examService.getStudentReportCard(this.studentId(), this.examId())
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          if (res.success) {
            this.student.set(res.data.student);
            this.summary.set(res.data.summary);
            this.gradesList.set(res.data.grades || []);
          }
        },
        error: () => this.loading.set(false)
      });
  }

  triggerPrint() {
    window.print();
  }
}
