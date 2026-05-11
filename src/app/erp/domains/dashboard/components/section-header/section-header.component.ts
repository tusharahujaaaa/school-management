import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex align-items-center justify-content-between mb-3">
      <h3 class="m-0 text-900 font-medium text-xl">{{ title }}</h3>
      <a *ngIf="actionLabel" href="javascript:void(0)" class="text-primary hover:underline font-medium cursor-pointer">
        {{ actionLabel }} <i class="pi pi-angle-right ml-1"></i>
      </a>
    </div>
  `
})
export class SectionHeaderComponent {
  @Input() title!: string;
  @Input() actionLabel?: string;
}
