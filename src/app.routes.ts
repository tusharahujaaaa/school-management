import { Routes } from '@angular/router';


export const appRoutes: Routes = [
    { path: '', pathMatch: "full", redirectTo: 'erp' },
    { path: 'erp', loadChildren: () => import('./app/erp/routes/erp.routes').then(m => m.erpRoutes) },

];
