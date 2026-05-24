import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom ERP Validators
 */
export class ERPValidators {
  /**
   * Phone number validator (Generic format)
   */
  static phone(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const phoneRegex = /^[0-9]{10,12}$/;
    return phoneRegex.test(control.value) ? null : { phone: true };
  }

  /**
   * Numeric only validator
   */
  static numeric(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const numericRegex = /^[0-9]*$/;
    return numericRegex.test(control.value) ? null : { numeric: true };
  }

  /**
   * Password strength validator
   */
  static passwordStrength(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const hasNumber = /[0-9]/.test(control.value);
    const hasUpper = /[A-Z]/.test(control.value);
    const hasLower = /[a-z]/.test(control.value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);
    const isValid = hasNumber && hasUpper && hasLower && hasSpecial && control.value.length >= 8;
    return isValid ? null : { passwordStrength: true };
  }

  /**
   * Confirm password match
   */
  static mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const control = group.get(controlName);
      const matchingControl = group.get(matchingControlName);

      if (!control || !matchingControl) return null;
      if (matchingControl.errors && !matchingControl.errors['mismatch']) return null;

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mismatch: true });
        return { mismatch: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }
}
