import { Component, ElementRef, ViewChild, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { GlobalSearchService } from './services/global-search.service';
import { SearchResult, SearchCategory } from './models/global-search.model';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [
        CommonModule, FormsModule, InputTextModule, ProgressSpinnerModule, TranslatePipe
    ],
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent {
  query = signal<string>('');
  isLoading = signal<boolean>(false);
  results = signal<SearchCategory[]>([]);
  showDropdown = signal<boolean>(false);

  private searchSubject = new Subject<string>();
  private searchService = inject(GlobalSearchService);

  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('dropdown') dropdown!: ElementRef;

  constructor() {
    this.searchSubject.pipe(
      tap(() => this.isLoading.set(true)),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => this.searchService.search(q))
    ).subscribe(data => {
      this.groupResults(data);
      this.isLoading.set(false);
    });
  }

  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.query.set(val);
    if (val.trim().length > 0) {
      this.showDropdown.set(true);
      this.searchSubject.next(val);
    } else {
      this.showDropdown.set(false);
      this.results.set([]);
    }
  }

  onFocus() {
    if (this.query().trim().length > 0) {
      this.showDropdown.set(true);
    }
  }

  private groupResults(data: SearchResult[]) {
    const grouped = data.reduce((acc, curr) => {
      if (!acc[curr.type]) {
        acc[curr.type] = { type: curr.type, label: this.getLabel(curr.type), results: [] };
      }
      acc[curr.type].results.push(curr);
      return acc;
    }, {} as Record<string, SearchCategory>);

    this.results.set(Object.values(grouped));
  }

  private getLabel(type: string): string {
    switch(type) {
      case 'student': return 'Students';
      case 'teacher': return 'Teachers';
      case 'staff': return 'Staff';
      default: return 'Others';
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    // If click is outside the component, hide dropdown
    if (this.searchInput && this.dropdown) {
      const clickedInsideInput = this.searchInput.nativeElement.parentElement?.contains(event.target as Node);
      const clickedInsideDropdown = this.dropdown.nativeElement.contains(event.target);
      if (!clickedInsideInput && !clickedInsideDropdown) {
        this.showDropdown.set(false);
      }
    }
  }
  
  clearSearch() {
    this.query.set('');
    this.showDropdown.set(false);
    this.results.set([]);
  }
}
