import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    c,
    children: [
      {
        path: '',
        loadComponent: () => import('./components/admin-selection/admin-selection.component').then(m => m.AdminSelectionComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./users/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'chats',
        loadComponent: () => import('./chats/chat-management/chat-management.component').then(m => m.ChatManagementComponent)
      },
      {
        path: 'departments',
        loadComponent: () => import('./departments/dept-management/dept-management.component').then(m => m.DeptManagementComponent)
      },
      {
        path: 'meetings',
        loadComponent: () => import('./meetings/meeting-management/meeting-management.component').then(m => m.MeetingManagementComponent)
      }
    ]
  }
];
