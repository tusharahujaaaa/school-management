export type EntityType = 'student' | 'teacher' | 'staff';

export interface SearchResult {
  id: string;
  name: string;
  type: EntityType;
  entityId: string; // STU-1023
  metadata: string; // e.g., "Class 10-A", "Physics Dept"
  avatar?: string;
  icon?: string;
}

export interface SearchCategory {
  type: EntityType;
  label: string;
  results: SearchResult[];
}
