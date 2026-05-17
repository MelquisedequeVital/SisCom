import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminHeader } from './admin-header/admin-header';

@Component({
  selector: 'app-admin.component',
  imports: [RouterOutlet, AdminHeader],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {}
