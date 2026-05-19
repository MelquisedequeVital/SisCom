import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { catchError, firstValueFrom, Observable, of } from 'rxjs';
import { ApiService } from './api.service';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api = inject(ApiService);
  private readonly apiUrl = 'http://localhost:4200/api/users';

  private usersSignal = signal<User[]>([]);
  public users = this.usersSignal.asReadonly();

  constructor() {
    this.loadUsers();
  }

  loadUsers() {
    this.api.getAll<User>(this.apiUrl).subscribe({
      next: (data) => this.usersSignal.set(data),
      error: (err) => console.error("Erro ao carregar usuários", err)
    })
  }

  addUser(user: Omit<User, 'id'>) {
    this.api.create<User>(this.apiUrl, user).subscribe({
      next: (newUserWithId) => this.usersSignal.update(oldUsers => [...oldUsers, newUserWithId]),
      error: (err) => console.error("Erro ao adicionar usuário: ", err)
    })
  }

  updateUser(userId: string, userData: Partial<User>) {

    const current = this.usersSignal().find(u => u.id == userId);
    const fullUpdatedData = { ...current, ...userData };

    this.api.update<User>(this.apiUrl, userId, fullUpdatedData).subscribe({
      next: (updatedUser) => {
        this.usersSignal.update(users =>
          users.map(u => u.id === userId ? updatedUser : u)
        )
      },
      error: (err) => console.error("Erro ao atualizar usuário: ", err)
    })
  }

  deleteUser(userId: string) {
    this.api.delete(this.apiUrl, userId).subscribe({
      next: () => {
        this.usersSignal.update(users =>
          users.filter(u => u.id !== userId)
        );
      },
      error: (err) => console.error("Erro ao deletar usuário: ", err)
    })
  }

  getUserById(id: string): Observable<User | undefined> {
    const cachedUser = this.usersSignal().find(u => u.id === id);

    if (cachedUser) {
      return of(cachedUser);
    }

    return this.api.getById<User>(this.apiUrl, id).pipe(
      catchError((error) => {
        console.error("Erro ao buscar usuário por ID:", error);
        return of(undefined);
      })
    );
  }
}
