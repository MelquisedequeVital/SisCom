import { Routes } from '@angular/router';
import { AdminComponent } from './admin-component/admin.component';

export const routes: Routes = [
    {
        path: 'admin',
        loadChildren: () => import('./admin-component/admin.routes').then(m => m.ADMIN_ROUTES), 
        title: 'Admin'
    }
];
