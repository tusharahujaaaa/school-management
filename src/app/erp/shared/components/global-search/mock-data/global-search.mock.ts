import { SearchResult } from '../models/global-search.model';

export const MOCK_SEARCH_DATA: SearchResult[] = [
  // Students
  { id: 's1', name: 'Rahul Sharma', type: 'student', entityId: 'STU-1023', metadata: 'Class 10-A', icon: 'pi pi-user' },
  { id: 's2', name: 'Aarav Patel', type: 'student', entityId: 'STU-1024', metadata: 'Class 9-C', icon: 'pi pi-user' },
  { id: 's3', name: 'Priya Singh', type: 'student', entityId: 'STU-1025', metadata: 'Class 12-Science', icon: 'pi pi-user' },
  { id: 's4', name: 'Aanya Kumar', type: 'student', entityId: 'STU-1026', metadata: 'Class 8-B', icon: 'pi pi-user' },
  { id: 's5', name: 'Rahul Verma', type: 'student', entityId: 'STU-1027', metadata: 'Class 10-B', icon: 'pi pi-user' },
  
  // Teachers
  { id: 't1', name: 'Dr. Vivek Sharma', type: 'teacher', entityId: 'TCH-042', metadata: 'Physics Department', icon: 'pi pi-book' },
  { id: 't2', name: 'Ms. Anjali Gupta', type: 'teacher', entityId: 'TCH-045', metadata: 'Mathematics Department', icon: 'pi pi-book' },
  { id: 't3', name: 'Mr. Rohan Das', type: 'teacher', entityId: 'TCH-048', metadata: 'Physical Education', icon: 'pi pi-book' },

  // Staff
  { id: 'st1', name: 'Amit Kumar', type: 'staff', entityId: 'STF-012', metadata: 'Administration', icon: 'pi pi-id-card' },
  { id: 'st2', name: 'Sunita Reddy', type: 'staff', entityId: 'STF-015', metadata: 'Finance Dept', icon: 'pi pi-id-card' },
  { id: 'st3', name: 'Ramesh Yadav', type: 'staff', entityId: 'STF-018', metadata: 'Transport Coordinator', icon: 'pi pi-id-card' }
];
