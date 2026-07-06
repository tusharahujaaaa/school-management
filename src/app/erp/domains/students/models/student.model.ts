export type StudentStatus = 'Active' | 'Inactive' | 'Pending' | 'Graduated' | 'Transferred';
export type Gender = 'Male' | 'Female' | 'Other';

export interface Student {
  id: string;
  // Basic Info
  photoUrl?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  gender: Gender;
  dateOfBirth?: string;
  bloodGroup?: string;

  // Academic Info
  admissionNumber: string;
  rollNumber: string;
  academicSession: string;
  class: string;
  section: string;
  admissionDate?: string;
  status: StudentStatus;

  // Contact Info
  contactNumber: string; // Student Mobile
  email?: string;
  emergencyContact?: string;

  // Address Info
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;

  // Parent info (placeholder for now)
  parentName?: string;
  parentContact?: string;
  busAssignment?: {
    id: string;
    busId: string;
    pickupPoint?: string;
    dropPoint?: string;
    isActive?: boolean;
    bus?: {
      id: string;
      schoolId: string;
      routeName: string;
      driverName: string;
      driverPhone?: string;
      plateNumber?: string;
      capacity?: number;
      isActive?: boolean;
    };
  };
}

export interface StudentFilters {
  class?: string;
  section?: string;
  gender?: Gender;
  status?: StudentStatus;
  academicSession?: string;
  searchTerm?: string;
}
