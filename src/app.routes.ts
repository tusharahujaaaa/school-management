import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    {
        path: 'admission-inquiry/:domain',
        loadComponent: () => import('./app/erp/domains/admissions/pages/admission-inquiry/admission-inquiry.component').then(m => m.AdmissionInquiryComponent)
    },
    {
        path: 'admission-inquiry',
        loadComponent: () => import('./app/erp/domains/admissions/pages/admission-inquiry/admission-inquiry.component').then(m => m.AdmissionInquiryComponent)
    },
    { path: '', pathMatch: "full", redirectTo: 'erp' },
    { path: 'erp', loadChildren: () => import('./app/erp/routes/erp.routes').then(m => m.erpRoutes) },
];
