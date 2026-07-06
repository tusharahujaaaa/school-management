import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentStore } from '../../store/student.store';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { ErpTableComponent } from '../../../../shared/ui/tables/erp-table.component';
import { StudentFiltersComponent } from '../../components/student-filters/student-filters.component';
import { StatusBadgeComponent } from '../../../../shared/ui/badges/status-badge.component';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Router, RouterModule } from '@angular/router';
import { HasPermissionDirective } from '../../../../core/permissions/directives/has-permission.directive';
import { ERP_PERMISSIONS } from '../../../../core/permissions/constants/permission.constants';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    ErpTableComponent,
    StudentFiltersComponent,
    StatusBadgeComponent,
    AvatarModule,
    ButtonModule,
    TooltipModule,
    HasPermissionDirective,
    RouterModule
  ],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})
export class StudentListComponent implements OnInit {
  protected store = inject(StudentStore);
  private router = inject(Router);

  readonly PERMISSIONS = ERP_PERMISSIONS;

  columns = [
    { field: 'photoUrl', header: 'Photo' },
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
}
