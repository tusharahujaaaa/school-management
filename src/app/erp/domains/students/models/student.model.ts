export type StudentStatus = 'Active' | 'Inactive' | 'Pending' | 'Graduated' | 'Transferred';
export type Gender = 'Male' | 'Female' | 'Other';

export interface Student {
  id: string;
  photoUrl?: string;
  admissionNumber: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  class: string;
  section: string;
  gender: Gender;
  status: StudentStatus;
  contactNumber: string;
  email?: string;
  dateOfBirth?: string;
  admissionDate?: string;
  address?: string;
  // Parent info (placeholder for now)
  parentName?: string;
  parentContact?: string;
}

export interface StudentFilters {
  class?: string;
  section?: string;
  gender?: Gender;
  status?: StudentStatus;
  academicSession?: string;
  searchTerm?: string;
}
