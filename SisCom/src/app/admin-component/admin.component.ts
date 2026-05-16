import { Component } from '@angular/core';
import { HeaderAdminComponent } from './header-admin/header-admin.component.ts';
import { AdminSelectionComponent } from './admin-selection/admin-selection.ts';

@Component({
  selector: 'app-admin.component',
  imports: [HeaderAdminComponent, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {}
