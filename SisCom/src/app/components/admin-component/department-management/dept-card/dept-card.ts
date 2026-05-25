import { Component, input, output } from '@angular/core';
import { Department } from '../../../../models/department.model';

@Component({
  selector: 'app-dept-card',
  imports: [],
  templateUrl: './dept-card.html',
  styleUrl: './dept-card.css',
})
export class DeptCard {
  public department = input.required<Department>();

  public onEdit = output<Department>();
  public onDelete = output<string>();
}
