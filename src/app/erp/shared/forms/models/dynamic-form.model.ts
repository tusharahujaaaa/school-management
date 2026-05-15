export type ErpFormFieldType = 'text' | 'number' | 'email' | 'password' | 'select' | 'datepicker' | 'textarea' | 'checkbox';

export interface ErpDynamicFieldConfig {
  name: string;
  label: string;
  type: ErpFormFieldType;
  placeholder?: string;
  initialValue?: any;
  options?: { label: string; value: any }[]; // For select/radio
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
  gridClass?: string; // e.g. 'col-12 md:col-6'
  hidden?: boolean;
  disabled?: boolean;
}

export interface ErpDynamicFormConfig {
  formId: string;
  fields: ErpDynamicFieldConfig[];
  submitLabel?: string;
}
