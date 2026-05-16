import { Routes } from '@angular/router';

export const routes: Routes = [
	{	path: '' , 
		loadComponent: () => import('./admin-component/admin.component.ts').then(m => m.AdminSelectionComponent),
, 		title: 'Admin'}
];
