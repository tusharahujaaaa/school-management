/**
 * ERP Form Option Interface
 */
export interface ERPFormOption {
  label: string;
  value: any;
  icon?: string;
  disabled?: boolean;
}

/**
 * Common Field Configuration (for dynamic foundation)
 */
export interface ERPFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'select' | 'date' | 'textarea' | 'checkbox' | 'radio' | 'file';
  placeholder?: string;
  defaultValue?: any;
  options?: ERPFormOption[];
  validations?: any[];
  colSpan?: number; // For layout grid (1-12)
  helperText?: string;
  loading?: boolean;
  disabled?: boolean;
}
