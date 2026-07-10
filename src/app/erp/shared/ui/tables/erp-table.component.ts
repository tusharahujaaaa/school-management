import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonLoaderComponent } from '../loaders/skeleton-loader.component';
import { EmptyStateComponent } from '../empty-states/empty-state.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-erp-table',
  standalone: true,
  imports: [
        CommonModule, TableModule, ButtonModule, InputTextModule, SkeletonLoaderComponent, EmptyStateComponent, TranslatePipe
    ],
  templateUrl: './erp-table.component.html',
  styleUrls: ['./erp-table.component.scss']
})
export class ErpTableComponent {
  @Input() title?: string;
  @Input({ required: true }) data: any[] = [];
  @Input({ required: true }) columns: any[] = [];
  
  @Input() loading: boolean = false;
  @Input() showSearch: boolean = true;
  @Input() rows: number = 10;
  @Input() paginator: boolean = true;
  @Input() responsiveLayout: string = 'scroll';
  
  @Input() emptyTitle: string = 'No records found';
  @Input() emptyDescription: string = 'Try adjusting your search or filters.';
  @Input() emptyIcon: string = 'pi pi-inbox';
  
  @Input() hasActions: boolean = false;

  /** 
   * Templates for custom column rendering.
   * Usage: <ng-template pTemplate="columnName" let-data>...</ng-template>
   */
  @Input() columnTemplates: Record<string, TemplateRef<any>> = {};
  @Input() actionTemplate!: TemplateRef<any>;

  @Output() search = new EventEmitter<string>();

  onSearch(event: any) {
    this.search.emit(event.target.value);
  }
}
