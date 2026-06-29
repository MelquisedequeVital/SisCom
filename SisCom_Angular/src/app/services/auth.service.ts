import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Observable, tap, map } from "rxjs";
import { User } from "../models/user.model";

interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/siscom';
  
  public currentUserSignal = signal<User | null>(this.getUserFromStorage());
  public currentUser = this.currentUserSignal.asReadonly();

  public login(credentials: any): Observable<User> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
        this.currentUserSignal.set(response.user);
      }),
      map((response) => response.user)
    );
  }

  public logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.currentUserSignal.set(null);
  }

  public getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getUserFromStorage(): User | null {
    if (typeof window === 'undefined') return null;
    const userJson = localStorage.getItem('auth_user');
    if (!userJson) return null;
    try {
      return JSON.parse(userJson) as User;
    } catch {
      return null;
    }
  }
}