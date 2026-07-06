import { Component, Input, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { ErpInputComponent } from '../../../../../shared/forms/controls/erp-input.component';
import { ErpSelectComponent } from '../../../../../shared/forms/controls/erp-select.component';
import { ErpDatepickerComponent } from '../../../../../shared/forms/controls/erp-datepicker.component';
import { FormFieldComponent } from '../../../../../shared/forms/wrappers/form-field.component';
import { STUDENT_STATUS_OPTIONS } from '../../../constants/student.constants';
import { ACADEMIC_SESSION_OPTIONS } from '../../../constants/student-form.constants';
import { StudentStore } from '../../../store/student.store';
import { StudentService } from '../../../services/student.service';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-student-academic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ErpInputComponent,
    ErpSelectComponent,
    ErpDatepickerComponent,
    FormFieldComponent,
    CheckboxModule
  ],
  templateUrl: './student-academic-form.component.html'
})
export class StudentAcademicFormComponent implements OnInit {
  @Input({ required: true }) group!: FormGroup;

  private store = inject(StudentStore);
  private studentService = inject(StudentService);

  statusOptions = STUDENT_STATUS_OPTIONS;
  sessionOptions = ACADEMIC_SESSION_OPTIONS;
  busesList = signal<any[]>([]);

  busOptions = computed(() => {
    return this.busesList().map(b => ({
      label: `${b.plateNumber || 'No Plate'} (${b.routeName})`,
      value: b.id
    }));
  });

  get classes() {
    return this.store.classes().map(c => ({ label: c, value: c }));
  }

  get sections() {
    return this.store.sections().map(s => ({ label: `Section ${s}`, value: s }));
  }

  ngOnInit() {
    this.loadBuses();
    this.setupTransportValidation();
  }

  private loadBuses() {
    this.studentService.getBuses().subscribe({
      next: (res: any) => {
        if (res?.success && Array.isArray(res.data)) {
          this.busesList.set(res.data);
        }
      },
      error: (err) => {
        console.error('Failed to load active bus routes for student form:', err);
      }
    });
  }

  private setupTransportValidation() {
    const usesCtrl = this.group.get('usesTransport');
    const busCtrl = this.group.get('busId');
    
    if (usesCtrl && busCtrl) {
      // Set initial validator state
      if (usesCtrl.value) {
        busCtrl.setValidators([Validators.required]);
      } else {
        busCtrl.clearValidators();
      }
      busCtrl.updateValueAndValidity();

      // Listen to changes
      usesCtrl.valueChanges.subscribe(uses => {
        if (uses) {
          busCtrl.setValidators([Validators.required]);
        } else {
          busCtrl.clearValidators();
          busCtrl.setValue(null);
          this.group.get('pickupPoint')?.setValue('');
          this.group.get('dropPoint')?.setValue('');
        }
        busCtrl.updateValueAndValidity();
      });
    }
  }
}
