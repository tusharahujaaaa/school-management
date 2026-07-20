import { Component, inject, OnInit, signal, computed, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StudentStore } from '../../store/student.store';
import { FeesHttpService } from '../../../fees/services/fees-http.service';
import { FeesService } from '../../../fees/services/fees.service';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../../shared/ui/badges/status-badge.component';
import { AvatarModule } from 'primeng/avatar';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { HasPermissionDirective } from '../../../../core/permissions/directives/has-permission.directive';
import { ERP_PERMISSIONS } from '../../../../core/permissions/constants/permission.constants';
import { SkeletonLoaderComponent } from '@/app/erp/shared/ui/loaders/skeleton-loader.component';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    ReactiveFormsModule,
    PageHeaderComponent, 
    StatusBadgeComponent,
    AvatarModule, 
    TabsModule, 
    CardModule,
    ButtonModule,
    TableModule,
    DialogModule,
    SelectModule,
    CheckboxModule,
    InputTextModule,
    HasPermissionDirective,
    SkeletonLoaderComponent,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.scss'
})
export class StudentProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  protected store = inject(StudentStore);
  private feesHttpSvc = inject(FeesHttpService);
  private fb = inject(FormBuilder);
  protected feesService = inject(FeesService);
  private destroyRef = inject(DestroyRef);
  private messageService = inject(MessageService);
  
  readonly PERMISSIONS = ERP_PERMISSIONS;

  // Fee Profile states
  feeProfile = signal<any>(null);
  loadingProfile = signal<boolean>(false);
  displayProfileDialog = signal<boolean>(false);
  profileForm!: FormGroup;

  displayPhotoDialog = signal<boolean>(false);
  uploadingPhoto = signal<boolean>(false);
  photoPreview = signal<string | null>(null);
  photoError = signal<string>('');
  photoForm!: FormGroup;

  discountReasons = [
    { label: 'Scholarship', value: 'SCHOLARSHIP' },
    { label: 'Staff Ward', value: 'STAFF_WARD' },
    { label: 'Sibling Discount', value: 'SIBLING' },
    { label: 'Merit Scholarship', value: 'MERIT' },
    { label: 'Financial Aid', value: 'FINANCIAL_AID' },
    { label: 'Other Reason', value: 'OTHER' }
  ];

  discountTypes = [
    { label: 'Percentage (%)', value: 'PERCENTAGE' },
    { label: 'Fixed Amount (₹)', value: 'FIXED' }
  ];

  // Fee ledger local state signals
  studentLedger = signal<any>(null);
  loadingLedger = signal<boolean>(false);

  // Flattened and sorted fee records
  allRecords = computed(() => {
    const ledger = this.studentLedger();
    if (!ledger || !ledger.records) return [];
    
    // Flatten grouped lists (PENDING, PAID, OVERDUE, WAIVED, PARTIAL)
    const all = Object.values(ledger.records).flat() as any[];
    
    // Sort by createdAt descending
    return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  // Dynamic aggregates summary computed from ledger summary object
  ledgerSummary = computed(() => {
    const ledger = this.studentLedger();
    if (!ledger || !ledger.summary) {
      return { paid: 0, pending: 0, overdue: 0 };
    }
    const sum = ledger.summary;
    return {
      paid: Number(sum.PAID?.total || 0),
      pending: Number(sum.PENDING?.total || 0),
      overdue: Number(sum.OVERDUE?.total || 0)
    };
  });
  
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.selectStudent(id);
      this.feesService.loadSessions();
      this.initProfileForm();
      this.initPhotoForm();
      this.loadFeeLedger(id);
      this.loadStudentFeeProfile(id);
    }
  }

  initPhotoForm() {
    this.photoForm = this.fb.group({
      photoUrl: ['', [Validators.required]]
    });
  }

  initProfileForm() {
    this.profileForm = this.fb.group({
      hasDiscount: [false],
      discountType: ['PERCENTAGE'],
      discountValue: [null],
      discountReason: ['SCHOLARSHIP'],
      isFeeWaived: [false],
      waiverReason: [''],
      remarks: ['']
    });

    // Add dynamic validation to discount values
    this.profileForm.get('hasDiscount')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(hasDisc => {
      const typeCtrl = this.profileForm.get('discountType');
      const valCtrl = this.profileForm.get('discountValue');
      if (hasDisc) {
        typeCtrl?.setValidators(Validators.required);
        valCtrl?.setValidators([Validators.required, Validators.min(0)]);
      } else {
        typeCtrl?.clearValidators();
        valCtrl?.clearValidators();
      }
      typeCtrl?.updateValueAndValidity();
      valCtrl?.updateValueAndValidity();
    });
  }

  loadFeeLedger(studentId: string) {
    this.loadingLedger.set(true);
    this.feesHttpSvc.getStudentLedger(studentId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.studentLedger.set(res.data);
        }
        this.loadingLedger.set(false);
      },
      error: (err: any) => {
        console.error('Error fetching student ledger:', err);
        this.loadingLedger.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Ledger Load Failed',
          detail: err?.error?.message || 'Unable to load student fee ledger.'
        });
      }
    });
  }

  loadStudentFeeProfile(studentId: string) {
    this.loadingProfile.set(true);
    this.feesHttpSvc.getStudentFeeProfile(studentId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.feeProfile.set(res.data);
        } else {
          this.feeProfile.set(null);
        }
        this.loadingProfile.set(false);
      },
      error: (err: any) => {
        console.error('Error loading student fee profile:', err);
        this.feeProfile.set(null);
        this.loadingProfile.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Profile Load Failed',
          detail: err?.error?.message || 'Unable to load student billing configurations.'
        });
      }
    });
  }

  openProfileModal() {
    const profile = this.feeProfile();
    this.profileForm.reset({
      hasDiscount: profile?.hasDiscount || false,
      discountType: profile?.discountType || 'PERCENTAGE',
      discountValue: profile?.discountValue ? Number(profile.discountValue) : null,
      discountReason: profile?.discountReason || 'SCHOLARSHIP',
      isFeeWaived: profile?.isFeeWaived || false,
      waiverReason: profile?.waiverReason || '',
      remarks: profile?.remarks || ''
    });
    this.displayProfileDialog.set(true);
  }

  submitFeeProfile() {
    if (this.profileForm.invalid) return;

    const studentId = this.store.selectedStudent()?.id;
    if (!studentId) return;

    const sessionId = this.feesService.activeSession()?.id;
    if (!sessionId) {
      alert('No active academic session found. Cannot configure fee profile.');
      return;
    }

    const payload = {
      ...this.profileForm.value,
      sessionId,
      discountValue: this.profileForm.value.hasDiscount ? Number(this.profileForm.value.discountValue) : null
    };

    this.feesHttpSvc.upsertStudentFeeProfile(studentId, payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.displayProfileDialog.set(false);
          this.loadStudentFeeProfile(studentId);
          this.loadFeeLedger(studentId);
        }
      },
      error: (err: any) => {
        console.error('Error saving fee profile:', err);
      }
    });
  }

  openPhotoDialog() {
    const photoUrl = this.store.selectedStudent()?.photoUrl || '';
    this.photoError.set('');
    this.photoPreview.set(photoUrl || null);
    this.photoForm.reset({ photoUrl });
    this.displayPhotoDialog.set(true);
  }

  onPhotoFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.photoError.set('');

    if (!file.type.startsWith('image/')) {
      this.photoError.set('Please choose a valid image file.');
      input.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.photoError.set('Please choose an image smaller than 2 MB.');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      this.photoPreview.set(dataUrl);
      this.photoForm.patchValue({ photoUrl: dataUrl });
      this.photoForm.markAsDirty();
    };
    reader.onerror = () => {
      this.photoError.set('Could not read the selected image.');
    };
    reader.readAsDataURL(file);
  }

  onPhotoUrlChange() {
    const value = this.photoForm.get('photoUrl')?.value?.trim() || '';
    this.photoError.set('');
    this.photoPreview.set(value || null);
  }

  saveStudentPhoto() {
    if (this.photoForm.invalid || this.uploadingPhoto()) return;

    const studentId = this.store.selectedStudent()?.id;
    const photoUrl = this.photoForm.value.photoUrl?.trim();
    if (!studentId || !photoUrl) return;

    this.uploadingPhoto.set(true);
    this.photoError.set('');

    this.store.updateStudentPhoto(studentId, photoUrl).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.uploadingPhoto.set(false);
        this.displayPhotoDialog.set(false);
      },
      error: (err: any) => {
        console.error('Error uploading student photo:', err);
        this.photoError.set(err?.error?.message || 'Could not save the student photo.');
        this.uploadingPhoto.set(false);
      }
    });
  }

  getSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary' {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'danger';
      case 'Pending': return 'warning';
      case 'Graduated': return 'primary';
      case 'Transferred': return 'info';
      default: return 'neutral';
    }
  }

  getFeeStatusClass(status: string): string {
    const s = (status || '').toUpperCase();
    if (s === 'PAID') return 'bg-green-50 text-green-700 border-green-200';
    if (s === 'PENDING') return 'bg-orange-50 text-orange-700 border-orange-200';
    if (s === 'OVERDUE') return 'bg-red-50 text-red-700 border-red-200';
    if (s === 'WAIVED') return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}
