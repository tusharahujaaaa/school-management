import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Component, Input, Optional, Self } from '@angular/core';

@Component({
  template: ''
})
export abstract class BaseControlValueAccessor<T> implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() helperText?: string;
  @Input() loading = false;
  @Input() required = false;

  value: T | null = null;

  onChange: (value: T | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: T): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onModelChange(value: T): void {
    this.value = value;
    this.onChange(value);
  }
}
