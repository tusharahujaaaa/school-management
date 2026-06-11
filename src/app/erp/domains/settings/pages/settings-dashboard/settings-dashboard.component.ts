import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-settings-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    TabsModule
  ],
  providers: [MessageService],
  templateUrl: './settings-dashboard.component.html'
})
export class SettingsDashboardComponent implements OnInit {
  protected settingsService = inject(SettingsService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  configForm!: FormGroup;

  ngOnInit() {
    this.initForm();
    this.loadConfigData();
  }

  initForm() {
    this.configForm = this.fb.group({
      tagline: [''],
      aboutText: [''],
      principalName: [''],
      principalMessage: [''],
      missionText: [''],
      visionText: [''],
      establishedYear: [null, [Validators.min(1800), Validators.max(2100)]],
      galleryUrlsText: [''], // Will split on newline
      facebook: [''],
      twitter: [''],
      instagram: [''],
      linkedin: [''],
      contactEmail: ['', [Validators.email]],
      contactPhone: [''],
      mapEmbedUrl: ['']
    });
  }

  loadConfigData() {
    this.settingsService.loadConfig();
    
    // Watch settingsService.config() signal changes
    // Alternatively, just subscribe/react when value loads
    // Since we are inside Angular, we can use an effect or just subscribe
    // Let's hook into the signal via an effect or simple interval, or just react by watching changes in template/controller
    // Let's create an effect to patch the form when config signal resolves
    // Wait, in OnInit we can just subscribe or run an angular effect
  }

  constructor() {
    const fb = inject(FormBuilder);
    // Angular 16+ allows effects in constructor, let's use an effect to sync the signal data to the Form Group!
    // Since we are using Angular 19, this is perfectly supported.
    // Wait! Let's register the effect in constructor.
    // Actually, writing it inside an effect in the constructor is standard and extremely elegant!
    // Let's do that:
    const settingsService = inject(SettingsService);
    
    import('@angular/core').then(({ effect }) => {
      effect(() => {
        const conf = settingsService.config();
        if (conf && this.configForm) {
          const social = conf.socialLinks || {};
          const gallery = Array.isArray(conf.galleryUrls) ? conf.galleryUrls.join('\n') : '';
          
          this.configForm.patchValue({
            tagline: conf.tagline || '',
            aboutText: conf.aboutText || '',
            principalName: conf.principalName || '',
            principalMessage: conf.principalMessage || '',
            missionText: conf.missionText || '',
            visionText: conf.visionText || '',
            establishedYear: conf.establishedYear || null,
            galleryUrlsText: gallery,
            facebook: social.facebook || '',
            twitter: social.twitter || '',
            instagram: social.instagram || '',
            linkedin: social.linkedin || '',
            contactEmail: conf.contactEmail || '',
            contactPhone: conf.contactPhone || '',
            mapEmbedUrl: conf.mapEmbedUrl || ''
          });
        }
      });
    });
  }

  onSubmit() {
    if (this.configForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fix form fields before saving.'
      });
      return;
    }

    const formVal = this.configForm.value;
    
    // Reconstruct payload
    const galleryUrls = formVal.galleryUrlsText
      ? formVal.galleryUrlsText.split('\n').map((u: string) => u.trim()).filter(Boolean)
      : [];

    const payload: any = {
      tagline: formVal.tagline || null,
      aboutText: formVal.aboutText || null,
      principalName: formVal.principalName || null,
      principalMessage: formVal.principalMessage || null,
      missionText: formVal.missionText || null,
      visionText: formVal.visionText || null,
      establishedYear: formVal.establishedYear ? Number(formVal.establishedYear) : null,
      galleryUrls: galleryUrls,
      socialLinks: {
        facebook: formVal.facebook || null,
        twitter: formVal.twitter || null,
        instagram: formVal.instagram || null,
        linkedin: formVal.linkedin || null
      },
      contactEmail: formVal.contactEmail || null,
      contactPhone: formVal.contactPhone || null,
      mapEmbedUrl: formVal.mapEmbedUrl || null
    };

    this.settingsService.saveConfig(payload).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Settings Saved',
            detail: 'Website config updated successfully.'
          });
          this.settingsService.loadConfig(); // Refresh local state
        }
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Save Failed',
          detail: err?.error?.message || 'Unable to update website configuration.'
        });
      }
    });
  }
}
