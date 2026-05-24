import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'erp-form-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid p-fluid" [ngClass]="containerClass">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .grid { margin-top: -1rem; }
  `]
})
export class FormLayoutComponent {
  @Input() containerClass = '';
}

@Component({
  selector: 'erp-form-col',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="columnClass">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class FormColumnComponent {
  @Input() size: 1 | 2 | 3 | 4 | 6 | 12 = 12;
  @Input() mdSize?: 1 | 2 | 3 | 4 | 6 | 12;
  @Input() lgSize?: 1 | 2 | 3 | 4 | 6 | 12;

  get columnClass(): string {
    const base = `col-${this.size}`;
    const md = this.mdSize ? ` md:col-${this.mdSize}` : '';
    const lg = this.lgSize ? ` lg:col-${this.lgSize}` : '';
    return `${base}${md}${lg} p-3`;
  }
}
