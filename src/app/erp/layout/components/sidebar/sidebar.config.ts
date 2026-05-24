import { SidebarGroup } from './sidebar.model';

/**
 * CENTRALIZED SIDEBAR NAVIGATION CONFIGURATION
 *
 * Each group has a groupLabel (section header) and an array of nav items.
 * Each item declares which `roles` can see it — empty array = all roles.
 * `disabled: true` renders the item as greyed out with a "Soon" badge.
 *
 * Future integration points:
 * - `permissionKey` → map to backend permission strings
 * - `moduleKey`     → feature-flag / module activation check
 * - `roles`         → RBAC filter applied in SidebarComponent
 */
export const ERP_SIDEBAR_CONFIG: SidebarGroup[] = [
  // ─── Core ────────────────────────────────────────────────
  {
    items: [
      {
        type: 'link',
        label: 'Dashboard',
        icon: 'pi pi-home',
        route: '/erp/dashboard',
        roles: ['admin', 'principal', 'teacher', 'accountant', 'hr'],
        permissionKey: 'dashboard.view',
        moduleKey: 'core'
      }
    ]
  },

  // ─── Attendance Module ────────────────────────────────────
  {
    groupLabel: 'Attendance',
    items: [
      // Admin / Principal / HR — full control
      {
        type: 'link',
        label: 'Overview',
        icon: 'pi pi-calendar',
        route: '/erp/attendance/dashboard',
        roles: ['admin', 'principal', 'hr', 'staff', 'accountant'],
        permissionKey: 'attendance.dashboard',
        moduleKey: 'attendance'
      },
      {
        type: 'link',
        label: 'Mark Students',
        icon: 'pi pi-users',
        route: '/erp/attendance/students',
        roles: ['admin', 'principal'],
        permissionKey: 'attendance.students.mark',
        moduleKey: 'attendance'
      },
      {
        type: 'link',
        label: 'Mark Staff',
        icon: 'pi pi-id-card',
        route: '/erp/attendance/staff',
        roles: ['admin', 'principal', 'hr'],
        permissionKey: 'attendance.staff.mark',
        moduleKey: 'attendance'
      },
      {
        type: 'link',
        label: 'History',
        icon: 'pi pi-history',
        route: '/erp/attendance/history',
        roles: ['admin', 'principal', 'hr'],
        permissionKey: 'attendance.history.view',
        moduleKey: 'attendance'
      },
      {
        type: 'link',
        label: 'Reports',
        icon: 'pi pi-chart-bar',
        route: '/erp/attendance/reports',
        roles: ['admin', 'principal', 'hr', 'accountant'],
        permissionKey: 'attendance.reports.view',
        moduleKey: 'attendance'
      },

      // Teacher — fast marking
      {
        type: 'link',
        label: 'My Class Attendance',
        icon: 'pi pi-pen-to-square',
        route: '/erp/attendance/teacher/mark',
        roles: ['teacher'],
        permissionKey: 'attendance.teacher.mark',
        moduleKey: 'attendance'
      },
      {
        type: 'link',
        label: 'Attendance History',
        icon: 'pi pi-history',
        route: '/erp/attendance/history',
        roles: ['teacher'],
        permissionKey: 'attendance.teacher.history',
        moduleKey: 'attendance'
      },

      // Parent — child visibility
      {
        type: 'link',
        label: "My Child's Attendance",
        icon: 'pi pi-heart',
        route: '/erp/attendance/parent/my-child',
        roles: ['parent'],
        permissionKey: 'attendance.parent.view',
        moduleKey: 'attendance'
      },

      // Student — self view
      {
        type: 'link',
        label: 'My Attendance',
        icon: 'pi pi-user',
        route: '/erp/attendance/student/my-attendance',
        roles: ['student'],
        permissionKey: 'attendance.student.view',
        moduleKey: 'attendance'
      }
    ]
  },

  // ─── Student Management ───────────────────────────────────
  {
    groupLabel: 'Management',
    items: [
      {
        type: 'link',
        label: 'Students',
        icon: 'pi pi-graduation-cap',
        route: '/erp/students',
        roles: ['admin', 'principal', 'teacher'],
        permissionKey: 'students.view',
        moduleKey: 'students'
      },
      {
        type: 'link',
        label: 'Teachers',
        icon: 'pi pi-book',
        route: '/erp/teachers',
        roles: ['admin', 'principal', 'hr'],
        permissionKey: 'teachers.view',
        moduleKey: 'teachers',
        disabled: true,
        badge: 'Soon'
      },
      {
        type: 'link',
        label: 'Fees & Finance',
        icon: 'pi pi-wallet',
        route: '/erp/fees',
        roles: ['admin', 'principal', 'accountant'],
        permissionKey: 'fees.view',
        moduleKey: 'fees',
        disabled: true,
        badge: 'Soon'
      },
      {
        type: 'link',
        label: 'Academics',
        icon: 'pi pi-book',
        route: '/erp/academics',
        roles: ['admin', 'principal', 'teacher'],
        permissionKey: 'academics.view',
        moduleKey: 'academics',
        disabled: true,
        badge: 'Soon'
      }
    ]
  },

  // ─── HR / Payroll ─────────────────────────────────────────
  {
    groupLabel: 'HR & Payroll',
    items: [
      {
        type: 'link',
        label: 'Staff Management',
        icon: 'pi pi-sitemap',
        route: '/erp/hr/staff',
        roles: ['admin', 'principal', 'hr'],
        permissionKey: 'hr.staff.view',
        moduleKey: 'hr',
        disabled: true,
        badge: 'Soon'
      },
      {
        type: 'link',
        label: 'Payroll',
        icon: 'pi pi-credit-card',
        route: '/erp/hr/payroll',
        roles: ['admin', 'hr', 'accountant'],
        permissionKey: 'hr.payroll.view',
        moduleKey: 'hr',
        disabled: true,
        badge: 'Soon'
      }
    ]
  },

  // ─── Communication ────────────────────────────────────────
  {
    groupLabel: 'Communication',
    items: [
      {
        type: 'link',
        label: 'Announcements',
        icon: 'pi pi-megaphone',
        route: '/erp/communication/announcements',
        roles: ['admin', 'principal', 'teacher'],
        permissionKey: 'communication.announcements',
        moduleKey: 'communication',
        disabled: true,
        badge: 'Soon'
      },
      {
        type: 'link',
        label: 'Messages',
        icon: 'pi pi-envelope',
        route: '/erp/communication/messages',
        permissionKey: 'communication.messages',
        moduleKey: 'communication',
        disabled: true,
        badge: 'Soon'
      }
    ]
  },

  // ─── Settings (Admin only) ───────────────────────────────
  {
    groupLabel: 'System',
    items: [
      {
        type: 'link',
        label: 'Settings',
        icon: 'pi pi-cog',
        route: '/erp/settings',
        roles: ['admin'],
        permissionKey: 'settings.view',
        moduleKey: 'settings',
        disabled: true,
        badge: 'Soon'
      }
    ]
  }
];
