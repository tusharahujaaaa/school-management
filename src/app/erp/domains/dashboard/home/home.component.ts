import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { ERP_BRANDING_CONFIG } from '../../../config/branding.config';
import { AuthService } from '../../auth/services/auth.service';

import { SectionHeaderComponent } from '../components/section-header/section-header.component';
import { StatCardComponent } from '../components/stat-card/stat-card.component';
import { ActivityListComponent } from '../components/activity-list/activity-list.component';
import { EventCardComponent } from '../components/event-card/event-card.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { UIChart } from 'primeng/chart';
import { TooltipModule } from 'primeng/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-erp-home',
  standalone: true,
  imports: [
        CommonModule, SectionHeaderComponent, StatCardComponent, ActivityListComponent, EventCardComponent, ProgressBarModule, UIChart, TooltipModule, TranslatePipe
    ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  branding = ERP_BRANDING_CONFIG;
  dashboardService = inject(DashboardService);
  authService = inject(AuthService);
  router = inject(Router);

  isStudent = this.authService.isStudent;
  isTeacher = this.authService.isTeacher;
  isAdmin = this.authService.isAdmin;

  // Admin dashboard signals
  stats = this.dashboardService.stats;
  activities = this.dashboardService.activities;
  events = this.dashboardService.events;
  quickActions = this.dashboardService.quickActions;
  attendanceOverview = this.dashboardService.attendanceOverview;
  feeOverview = this.dashboardService.feeOverview;

  // Student dashboard signals
  studentAttendancePercentage = this.dashboardService.studentAttendancePercentage;
  upcomingExams = this.dashboardService.upcomingExams;
  studentNotices = this.dashboardService.studentNotices;

  // Teacher dashboard signals
  assignedClasses = this.dashboardService.assignedClasses;
  pendingAttendance = this.dashboardService.pendingAttendance;
  teacherAnnouncements = this.dashboardService.teacherAnnouncements;

  ngOnInit() {
    this.dashboardService.loadDashboardData();
  }

  navigateToAction(route?: string) {
    if (route) {
      this.router.navigateByUrl(route);
    }
  }

  // Monthly paid vs unpaid fee chart data (computed dynamically from API response)
  feeChartData = computed(() => {
    const data = this.feeOverview();
    const comparison = data?.monthlyComparison || [];
    
    const labels = comparison.map((item: any) => item.month);
    const paidData = comparison.map((item: any) => item.paid);
    const unpaidData = comparison.map((item: any) => item.unpaid);

    return {
      labels: labels.length ? labels : ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [
        {
          label: 'Paid Fees',
          backgroundColor: '#10b981', // emerald-500
          borderColor: '#10b981',
          data: paidData.length ? paidData : [0, 0, 0, 0, 0, 0],
          borderRadius: 4
        },
        {
          label: 'Unpaid Fees',
          backgroundColor: '#f43f5e', // rose-500
          borderColor: '#f43f5e',
          data: unpaidData.length ? unpaidData : [0, 0, 0, 0, 0, 0],
          borderRadius: 4
        }
      ]
    };
  });

  // Modern Chart.js options
  feeChartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 1.8,
    plugins: {
      legend: {
        labels: {
          color: '#4b5563', // gray-600
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11,
            weight: '500'
          }
        },
        position: 'top',
        align: 'end'
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        padding: 10,
        cornerRadius: 8,
        font: {
          family: 'Inter, system-ui, sans-serif'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#6b7280', // gray-500
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11
          }
        },
        grid: {
          color: 'transparent',
          drawBorder: false
        }
      },
      y: {
        ticks: {
          color: '#6b7280', // gray-500
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11
          },
          callback: (value: any) => '₹' + value.toLocaleString()
        },
        grid: {
          color: '#f3f4f6', // gray-100
          drawBorder: false
        }
      }
    }
  };
}
