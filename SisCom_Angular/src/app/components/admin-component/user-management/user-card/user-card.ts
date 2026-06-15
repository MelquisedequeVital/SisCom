import { Component, input, output, signal } from '@angular/core';
import { User } from '../../../../models/user.model';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-user-card',
  imports: [NgClass, DatePipe],
  templateUrl: './user-card.html',
  styleUrl: './user-card.css',
})
export class UserCard {

  public user = input.required<User>();

  public onEdit = output<User>();
  public onDelete = output<string>();

  public isExpanded = signal<boolean>(false);

  get initials(): string {
    const name = this.user().name;
    if (!name) return 'US';
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  }

  toggleExpand(): void {
    this.isExpanded.update(current => !current);
  }
}
