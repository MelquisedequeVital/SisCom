import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

export const ADMIN_ROUTES: Routes = [
 {
  path: '',
  component: AdminComponent,
  children: [
    {
      path: '',
      loadComponent: () => import('./admin-selection/admin-selection').then(a => a.AdminSelection),
    },
    {
      path: 'users',
      loadComponent: () => import('./user-management/user-management').then(a => a.UserManagement),
    }
  ]
 }
];
