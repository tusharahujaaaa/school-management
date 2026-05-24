import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { StudentStore } from '../../store/student.store';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { STUDENT_STATUS_OPTIONS, GENDER_OPTIONS } from '../../constants/student.constants';

@Component({
  selector: 'app-student-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectModule, InputTextModule, ButtonModule],
  templateUrl: './student-filters.component.html',
  styleUrl: './student-filters.component.scss'
})
export class StudentFiltersComponent {
  private fb = inject(FormBuilder);
  private store = inject(StudentStore);

  filterForm = this.fb.group({
    searchTerm: [''],
    class: [null],
    section: [null],
    status: [null],
    gender: [null]
  });

  get classes() {
    return this.store.classes().map(c => ({ label: c, value: c }));
  }

  get sections() {
    return this.store.sections().map(s => ({ label: `Section ${s}`, value: s }));
  }

  statuses = STUDENT_STATUS_OPTIONS;
  genders = GENDER_OPTIONS;

  constructor() {
    this.filterForm.valueChanges.subscribe(values => {
      this.store.updateFilters(values as any);
    });
  }

  clearFilters() {
    this.filterForm.reset();
  }
}
