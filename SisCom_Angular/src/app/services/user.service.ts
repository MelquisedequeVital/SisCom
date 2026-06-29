import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { catchError, Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api = inject(ApiService);
  private readonly apiUrl = 'http://localhost:8080/api/siscom/users';

  private usersSignal = signal<User[]>([]);
  public users = this.usersSignal.asReadonly();

  constructor() {
    // this.loadUsers();
  }

  loadUsers() {
    this.api.getAll<User>(this.apiUrl).subscribe({
      next: (data) => this.usersSignal.set(data),
      error: (err) => console.error("Erro ao carregar usuários", err)
    });

    
  }

  addUser(user: Omit<User, 'id'>) {
    return this.api.create<User>(this.apiUrl, user).pipe(
      tap((newUserWithId) => this.usersSignal.update(oldUsers => [...oldUsers, newUserWithId]))
    );
  }

  updateUser(userId: string, userData: Partial<User>) {
    const current = this.usersSignal().find(u => u.id === userId);
    
    if (!current) {
      return throwError(() => new Error("Usuário não encontrado no cache local para atualização"));
    }


    return this.api.update<User>(this.apiUrl, userId, userData).pipe(
      tap((updatedUser) => {
        this.usersSignal.update(users =>
          users.map(u => u.id === userId ? updatedUser : u)
        );
      })
    );
  }

  deleteUser(userId: string) {
    return this.api.delete(this.apiUrl, userId).pipe(
      tap(() => {
        this.usersSignal.update(users =>
          users.filter(u => u.id !== userId)
        );
      })
    );
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