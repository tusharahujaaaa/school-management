import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { splitCSVLine } from '../../../../shared/utils/csv.utils';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../../students/services/student.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

interface ParsedStudentRow {
  data: {
    name: string;
    rollNumber: string;
    className: string;
    section: string;
    gender: string;
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    address: string;
  };
  classId: string | null;
  classResolved: boolean;
  error: string | null;
  status: 'PENDING' | 'SUCCESS' | 'ERROR';
  errorMsg?: string;
}

@Component({
  selector: 'app-admit-bulk',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    ButtonModule,
    TableModule
  ],
  providers: [MessageService],
  templateUrl: './admit-bulk.component.html'
})
export class AdmitBulkComponent implements OnInit {
  private studentSvc = inject(StudentService);
  private messageService = inject(MessageService);

  classesMap = signal<any[]>([]); // holds raw list: { label: "Class 5 A", value: "uuid", name: "Class 5", section: "A" }

  selectedFileName = signal<string>('');
  parsedStudents = signal<ParsedStudentRow[]>([]);
  
  isImporting = signal<boolean>(false);
  importCompleted = signal<boolean>(false);
  importSuccessCount = signal<number>(0);
  importFailCount = signal<number>(0);
  importProgress = signal<number>(0);
  importLogs = signal<string[]>([]);

  hasErrors = computed(() => this.parsedStudents().some(s => s.error !== null));

  ngOnInit() {
    this.loadClassesSetup();
  }

  loadClassesSetup() {
    this.studentSvc.getSetupData().subscribe({
      next: (res: any) => {
        if (res?.success && res.data && Array.isArray(res.data.classes)) {
          this.classesMap.set(res.data.classes);
        }
      },
      error: (err) => console.error('Error fetching classes mapping for bulk import:', err)
    });
  }

  downloadTemplate() {
    const csvContent = 'Name,RollNumber,Class,Section,Gender,ParentName,ParentPhone,ParentEmail,Address\n' +
                       'Jane Doe,102,Class 5,A,FEMALE,Richard Doe,9876543211,richard@example.com,123 Green Avenue\n' +
                       'John Smith,,Class 5,A,MALE,Sara Smith,9876543212,,456 Pine Street\n';
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'student_bulk_admit_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFileName.set(file.name);
    
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const text = e.target.result;
      this.parseCSV(text);
    };
    reader.readAsText(file);
  }

  parseCSV(text: string) {
    const lines = text.split(/\r?\n/);
    if (lines.length < 2) {
      this.messageService.add({ severity: 'error', summary: 'Empty CSV', detail: 'The uploaded file does not contain any records.' });
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const expectedHeaders = ['name', 'rollnumber', 'class', 'section', 'gender', 'parentname', 'parentphone', 'parentemail', 'address'];
    
    // Validate headers
    const headersValid = expectedHeaders.every(eh => headers.includes(eh));
    if (!headersValid) {
      this.messageService.add({ severity: 'error', summary: 'Header Mismatch', detail: 'CSV headers do not match the template format.' });
      return;
    }

    // Map header indices
    const idx = {
      name: headers.indexOf('name'),
      rollNumber: headers.indexOf('rollnumber'),
      className: headers.indexOf('class'),
      section: headers.indexOf('section'),
      gender: headers.indexOf('gender'),
      parentName: headers.indexOf('parentname'),
      parentPhone: headers.indexOf('parentphone'),
      parentEmail: headers.indexOf('parentemail'),
      address: headers.indexOf('address')
    };

    const parsedRows: ParsedStudentRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // skip empty lines

      // Handle simple comma separation (ignoring internal commas inside quotes for simplicity, or simple strip)
      const cols = splitCSVLine(line);
      if (cols.length < headers.length) {
        parsedRows.push({
          data: { name: cols[0] || 'Unknown', rollNumber: '', className: '', section: '', gender: '', parentName: '', parentPhone: '', parentEmail: '', address: '' },
          classId: null,
          classResolved: false,
          error: 'Columns count mismatch. Row details corrupted.',
          status: 'PENDING'
        });
        continue;
      }

      const rowData = {
        name: cols[idx.name]?.trim() || '',
        rollNumber: cols[idx.rollNumber]?.trim() || '',
        className: cols[idx.className]?.trim() || '',
        section: cols[idx.section]?.trim() || '',
        gender: (cols[idx.gender]?.trim() || 'MALE').toUpperCase(),
        parentName: cols[idx.parentName]?.trim() || '',
        parentPhone: cols[idx.parentPhone]?.trim() || '',
        parentEmail: cols[idx.parentEmail]?.trim() || '',
        address: cols[idx.address]?.trim() || ''
      };

      // Validations
      let error: string | null = null;
      if (!rowData.name) {
        error = 'Student Name is required.';
      } else if (!rowData.parentPhone) {
        error = 'Parent Phone is required.';
      } else if (!rowData.className || !rowData.section) {
        error = 'Class and Section are required.';
      }

      // Resolve Class ID
      let classId: string | null = null;
      let classResolved = false;

      if (rowData.className && rowData.section) {
        const found = this.classesMap().find(c => 
          c.name.toLowerCase() === rowData.className.toLowerCase() && 
          c.section.toLowerCase() === rowData.section.toLowerCase()
        );
        if (found) {
          classId = found.id;
          classResolved = true;
        } else {
          error = error ? error + ' Class/Section not found.' : 'Class/Section not found.';
        }
      }

      parsedRows.push({
        data: rowData,
        classId,
        classResolved,
        error,
        status: 'PENDING'
      });
    }

    this.parsedStudents.set(parsedRows);
    this.messageService.add({ severity: 'success', summary: 'Parsed CSV', detail: `Identified ${parsedRows.length} rows to review.` });
  }

  clearFile() {
    this.selectedFileName.set('');
    this.parsedStudents.set([]);
    this.isImporting.set(false);
    this.importCompleted.set(false);
    this.importSuccessCount.set(0);
    this.importFailCount.set(0);
    this.importProgress.set(0);
    this.importLogs.set([]);
  }

  async startBulkImport() {
    const students = this.parsedStudents();
    if (students.length === 0 || this.hasErrors()) return;

    this.isImporting.set(true);
    this.importCompleted.set(false);
    this.importSuccessCount.set(0);
    this.importFailCount.set(0);
    this.importProgress.set(0);
    this.importLogs.set(['[SYSTEM] Starting bulk enrollment run...']);

    // Sequential API calls to avoid request congestion
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const payload = {
        classId: student.classId,
        name: student.data.name,
        rollNumber: student.data.rollNumber || null,
        gender: student.data.gender,
        parentName: student.data.parentName || 'Parent',
        parentPhone: student.data.parentPhone,
        parentEmail: student.data.parentEmail || null,
        address: student.data.address || null,
        status: 'ACTIVE'
      };

      try {
        const logMsg = `Enrolling student ${i + 1}/${students.length}: ${payload.name}...`;
        this.importLogs.update(logs => [...logs, logMsg]);

        const res: any = await this.studentSvc.createStudent(payload).toPromise();
        
        if (res?.success) {
          student.status = 'SUCCESS';
          this.importSuccessCount.update(c => c + 1);
          this.importLogs.update(logs => [...logs, `   -> ${payload.name} enrolled successfully.`]);
        } else {
          student.status = 'ERROR';
          student.errorMsg = 'API returned failed code';
          this.importFailCount.update(c => c + 1);
          this.importLogs.update(logs => [...logs, `   -> Failed to enroll ${payload.name}: API rejection`]);
        }
      } catch (err: any) {
        student.status = 'ERROR';
        student.errorMsg = err?.error?.message || 'Server error';
        this.importFailCount.update(c => c + 1);
        this.importLogs.update(logs => [...logs, `   -> Failed to enroll ${payload.name}: ${student.errorMsg}`]);
      }

      // Update progress bar
      const progress = Math.round(((i + 1) / students.length) * 100);
      this.importProgress.set(progress);
    }

    this.isImporting.set(false);
    this.importCompleted.set(true);
    this.importLogs.update(logs => [...logs, '[SYSTEM] Bulk enrollment completed.']);
    
    this.messageService.add({
      severity: 'success',
      summary: 'Import Completed',
      detail: `Success: ${this.importSuccessCount()}, Failures: ${this.importFailCount()}`
    });
  }
}
