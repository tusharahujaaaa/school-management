/**
 * Centralized Validation Error Messages
 */
export const ERP_VALIDATION_MESSAGES: Record<string, (args?: any) => string> = {
  required: () => 'This field is required',
  email: () => 'Please enter a valid email address',
  minlength: (args: { requiredLength: number }) => `Minimum ${args.requiredLength} characters required`,
  maxlength: (args: { requiredLength: number }) => `Maximum ${args.requiredLength} characters allowed`,
  pattern: () => 'Invalid format',
  min: (args: { min: number }) => `Value must be at least ${args.min}`,
  max: (args: { max: number }) => `Value must be at most ${args.max}`,
  phone: () => 'Invalid phone number format',
  numeric: () => 'Only numeric values allowed',
  mismatch: () => 'Passwords do not match',
  passwordStrength: () => 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
};
