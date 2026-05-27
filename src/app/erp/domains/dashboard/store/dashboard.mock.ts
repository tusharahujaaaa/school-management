import { StatData, ActivityData, EventData, NotificationData, QuickAction } from '../models/dashboard.model';

export const MOCK_STATS: StatData[] = [
  { title: 'Total Students', value: '2,845', icon: 'pi pi-users', trend: '12 new this week', trendUp: true, colorClass: 'bg-blue-50 text-blue-600' },
  { title: 'Total Staff', value: '142', icon: 'pi pi-id-card', trend: '2 on leave', trendUp: false, colorClass: 'bg-purple-50 text-purple-600' },
  { title: 'Today Attendance', value: '94.5%', icon: 'pi pi-check-circle', trend: 'Up 1.2% from yesterday', trendUp: true, colorClass: 'bg-green-50 text-green-600' },
  { title: 'Pending Fees', value: '₹45,200', icon: 'pi pi-indian-rupee', trend: '8% of total expected', trendUp: false, colorClass: 'bg-orange-50 text-orange-600' },
  { title: 'Active Classes', value: '48', icon: 'pi pi-building', trend: 'All running smoothly', trendUp: true, colorClass: 'bg-cyan-50 text-cyan-600' },
  { title: 'New Admissions', value: '124', icon: 'pi pi-user-plus', trend: '15% increase YoY', trendUp: true, colorClass: 'bg-teal-50 text-teal-600' },
];

export const MOCK_ACTIVITIES: ActivityData[] = [
  { id: '1', title: 'Student Admitted', description: 'Rahul Sharma admitted to Grade 10', time: '10 mins ago', icon: 'pi pi-user-plus', colorClass: 'text-green-500 bg-green-50' },
  { id: '2', title: 'Fee Submitted', description: 'Grade 8 Section A - Term 2 Fees', time: '1 hour ago', icon: 'pi pi-wallet', colorClass: 'text-blue-500 bg-blue-50' },
  { id: '3', title: 'Attendance Updated', description: 'Grade 5 attendance marked complete', time: '2 hours ago', icon: 'pi pi-check', colorClass: 'text-teal-500 bg-teal-50' },
  { id: '4', title: 'Staff Added', description: 'New Physics teacher joined', time: '4 hours ago', icon: 'pi pi-user-edit', colorClass: 'text-orange-500 bg-orange-50' },
];

export const MOCK_EVENTS: EventData[] = [
  { id: '1', title: 'Mid-Term Examinations', date: 'Oct 15 - Oct 25', type: 'Exam' },
  { id: '2', title: 'Parent Teacher Meeting', date: 'Nov 02', type: 'Meeting' },
  { id: '3', title: 'Diwali Holidays', date: 'Nov 10 - Nov 14', type: 'Holiday' },
  { id: '4', title: 'Annual Sports Day', date: 'Dec 05', type: 'Event' },
];

export const MOCK_NOTIFICATIONS: NotificationData[] = [
  { id: '1', message: 'Leave approval pending for 3 staff members', type: 'warning', time: '10 mins ago' },
  { id: '2', message: 'Grade 10-B attendance below 80% today', type: 'danger', time: '1 hour ago' },
  { id: '3', message: 'Term 2 Fee reminders sent to 150 parents', type: 'success', time: '3 hours ago' },
  { id: '4', message: 'System maintenance scheduled for tonight', type: 'info', time: '5 hours ago' },
];

export const MOCK_QUICK_ACTIONS: QuickAction[] = [
  { label: 'Add Student', icon: 'pi pi-user-plus', route: '/erp/students/create', colorClass: 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200' },
  { label: 'Mark Attendance', icon: 'pi pi-check-square', route: '/erp/attendance/students', colorClass: 'bg-green-50 text-green-600 hover:bg-green-100 border-green-200' },
  { label: 'Collect Fees', icon: 'pi pi-wallet', route: '/erp/dashboard', colorClass: 'bg-orange-50 text-orange-600 hover:bg-orange-100 border-orange-200' },
  { label: 'Create Notice', icon: 'pi pi-bullhorn', route: '/erp/dashboard', colorClass: 'bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-200' },
  { label: 'Generate ID', icon: 'pi pi-id-card', route: '/erp/dashboard', colorClass: 'bg-teal-50 text-teal-600 hover:bg-teal-100 border-teal-200' },
];
