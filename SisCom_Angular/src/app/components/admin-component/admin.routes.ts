import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { InboxComponent } from '../inbox-component/inbox-component';

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
      },
      {
        path:'departments',
        loadComponent: () => import('./department-management/department-management').then(a => a.DepartmentManagement)
      }
    ]
  }
];
