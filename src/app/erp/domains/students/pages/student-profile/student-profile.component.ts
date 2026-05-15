import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StudentStore } from '../../store/student.store';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../../shared/ui/badges/status-badge.component';
import { AvatarModule } from 'primeng/avatar';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { HasPermissionDirective } from '../../../../core/permissions/directives/has-permission.directive';
import { ERP_PERMISSIONS } from '../../../../core/permissions/constants/permission.constants';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    PageHeaderComponent, 
    StatusBadgeComponent,
    AvatarModule, 
    TabsModule, 
    CardModule,
    ButtonModule,
    HasPermissionDirective
  ],
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.scss'
})
export class StudentProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  protected store = inject(StudentStore);
  
  readonly PERMISSIONS = ERP_PERMISSIONS;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.selectStudent(id);
    }
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
