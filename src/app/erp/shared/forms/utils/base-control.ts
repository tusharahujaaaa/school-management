import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Component, Input, Optional, Self, inject } from '@angular/core';

@Component({ template: '' })
export abstract class BaseControlValueAccessor<T> implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() id = `erp-control-${Math.random().toString(36).substring(2, 9)}`;

  value: T | null = null;
  
  onChange: (value: T | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor(@Optional() @Self() public controlDir: NgControl | null) {
    if (this.controlDir) {
      this.controlDir.valueAccessor = this;
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

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleInputChange(val: T): void {
    this.value = val;
    this.onChange(val);
    this.onTouched();
  }
}
