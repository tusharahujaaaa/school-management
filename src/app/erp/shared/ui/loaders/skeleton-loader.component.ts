import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-erp-skeleton-loader',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss']
})
export class SkeletonLoaderComponent {
  @Input() type: 'table' | 'card' | 'list' | 'generic' = 'generic';
  @Input() width: string = '100%';
  @Input() height: string = '1rem';
  @Input() shape: 'rectangle' | 'circle' = 'rectangle';
  @Input() containerClass: string = '';
}
