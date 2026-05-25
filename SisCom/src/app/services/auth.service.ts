import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(ApiService);
  
  private readonly loginUrl = 'http://localhost:4200/api/login'; 
  private readonly usersUrl = 'http://localhost:4200/api/users';

  private currentUserSignal = signal<User | null>(null);
  public currentUser = this.currentUserSignal.asReadonly();

  constructor() {
    this.checkSavedSession();
  }

  login(email: string, password: string, rememberMe: boolean): Observable<User> {
    return this.api.create<User>(this.loginUrl, { email, password }).pipe(
      tap(user => {
        this.currentUserSignal.set(user);
        
        if (rememberMe) {
          localStorage.setItem('loggedUserId', user.id);
        } else {
          sessionStorage.setItem('loggedUserId', user.id);
        }
      })
    );
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('loggedUserId');
    sessionStorage.removeItem('loggedUserId');
  }

  private checkSavedSession() {
    const savedId = localStorage.getItem('loggedUserId') || sessionStorage.getItem('loggedUserId');
    
    if (savedId) {
      this.api.getById<User>(this.usersUrl, savedId).subscribe({
        next: (user) => {
          if (user) this.currentUserSignal.set(user);
        },
        error: () => this.logout()
      });
    }
  }
}
