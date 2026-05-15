import { FormGroup, AbstractControl, FormArray } from '@angular/forms';

/**
 * ERP Form Utilities
 */
export class ERPFormUtils {
  /**
   * Mark all controls in a form group as touched to trigger validation messages
   */
  static markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if ((control as any).controls) {
        this.markFormGroupTouched(control as any);
      }
    });
  }

  /**
   * Reset form and clear specific flags
   */
  static resetForm(form: FormGroup): void {
    form.reset();
    form.markAsPristine();
    form.markAsUntouched();
  }

  /**
   * Get all validation errors from a form group
   */
  static getAllErrors(form: FormGroup | FormArray): { [key: string]: any } {
    let errors: { [key: string]: any } = {};
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control instanceof FormGroup || control instanceof FormArray) {
        errors = { ...errors, ...this.getAllErrors(control) };
      } else {
        const controlErrors = control?.errors;
        if (controlErrors) {
          errors[key] = controlErrors;
        }
      }
    });
    return errors;
  }

  /**
   * Patch form with deep object matching
   */
  static patchForm(form: FormGroup, data: any): void {
    if (!data) return;
    form.patchValue(data, { emitEvent: false });
  }
}
