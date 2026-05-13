/**
 * ERP Shared Types
 * Central type definitions used across ERP domains and layout layers.
 * Import from here to avoid circular dependencies.
 */

export type ErpRole =
  | 'admin'
  | 'principal'
  | 'teacher'
  | 'parent'
  | 'student'
  | 'accountant'
  | 'staff'
  | 'hr';
