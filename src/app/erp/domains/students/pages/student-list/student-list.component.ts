import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentStore } from '../../store/student.store';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { ErpTableComponent } from '../../../../shared/ui/tables/erp-table.component';
import { StudentFiltersComponent } from '../../components/student-filters/student-filters.component';
import { StatusBadgeComponent } from '../../../../shared/ui/badges/status-badge.component';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { HasPermissionDirective } from '../../../../core/permissions/directives/has-permission.directive';
import { ERP_PERMISSIONS } from '../../../../core/permissions/constants/permission.constants';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    ErpTableComponent,
    StudentFiltersComponent,
    StatusBadgeComponent,
    AvatarModule,
    ButtonModule,
    TooltipModule,
    SelectModule,
    ToastModule,
    HasPermissionDirective,
    RouterModule
  ],
  providers: [MessageService],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})
export class StudentListComponent implements OnInit {
  protected store = inject(StudentStore);
  private router = inject(Router);
  private messageService = inject(MessageService);

  readonly PERMISSIONS = ERP_PERMISSIONS;

  statusOptions = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Graduated', value: 'GRADUATED' },
    { label: 'Transferred', value: 'TRANSFERRED' }
  ];

  columns = [
    // { field: 'photoUrl', header: 'Photo' },
    { field: 'admissionNumber', header: 'Adm No' },
    { field: 'rollNumber', header: 'Roll No' },
    { field: 'fullName', header: 'Name' },
    { field: 'class', header: 'Class' },
    { field: 'section', header: 'Section' },
    { field: 'gender', header: 'Gender' },
    { field: 'status', header: 'Status' },
    { field: 'contactNumber', header: 'Contact' }
  ];

  ngOnInit() {
    this.store.loadStudents(); 
  }

  viewProfile(id: string) {
    this.router.navigate(['/erp/students', id]);
  }

  onGlobalSearch(term: string) {
    this.store.updateFilters({ searchTerm: term });
  }

  onStatusChange(studentId: string, status: string) {
    this.store.updateStudentStatus(studentId, status).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Status Updated',
          detail: `Student status successfully changed to ${status}.`
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: err?.error?.message || 'Unable to update student status.'
        });
      }
    });
  }

  getSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary' {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'danger';
      case 'Pending': return 'warning';
      case 'Graduated': return 'primary';
      case 'Transferred': return 'info';
      default: return 'neutral';
    }
  }

  getActiveStatusClass(status: string): string {
    const s = (status || '').toUpperCase();
    if (s === 'ACTIVE') return 'bg-green-50 text-green-700 border-green-200';
    if (s === 'INACTIVE') return 'bg-red-50 text-red-700 border-red-200';
    if (s === 'PENDING') return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    if (s === 'GRADUATED') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (s === 'TRANSFERRED') return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}
