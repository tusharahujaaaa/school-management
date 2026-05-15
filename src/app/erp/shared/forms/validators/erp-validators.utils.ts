import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class ErpValidators {
  /**
   * Phone number validator (Generic format)
   */
  static phone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      return phoneRegex.test(value) ? null : { phone: true };
    };
  }

  /**
   * Numeric only validator
   */
  static numeric(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      
      const numericRegex = /^[0-9]+$/;
      return numericRegex.test(value) ? null : { numeric: true };
    };
  }

  /**
   * Password mismatch validator for confirm password fields
   */
  static match(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent) return null;
      
      const matchToControl = parent.get(matchTo);
      if (!matchToControl) return null;
      
      return control.value === matchToControl.value ? null : { mismatch: true };
    };
  }
}
