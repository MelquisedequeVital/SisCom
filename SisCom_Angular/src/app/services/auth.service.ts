import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Observable, tap, map } from "rxjs";
import { User } from "../models/user.model";
import { environment } from "../../environments/enviroment";

interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  
  public currentUserSignal = signal<User | null>(this.getUserFromStorage());
  public currentUser = this.currentUserSignal.asReadonly();

  public login(credentials: any): Observable<User> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        sessionStorage.setItem('auth_token', response.token);
        sessionStorage.setItem('auth_user', JSON.stringify(response.user));
        this.currentUserSignal.set(response.user);
      }),
      map((response) => response.user)
    );
  }

  public logout(): void {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');
    this.currentUserSignal.set(null);
  }

  public getToken(): string | null {
    return sessionStorage.getItem('auth_token');
  }

  private getUserFromStorage(): User | null {
    if (typeof window === 'undefined') return null;
    const userJson = sessionStorage.getItem('auth_user');
    if (!userJson) return null;
    try {
      return JSON.parse(userJson) as User;
    } catch {
      return null;
    }
  }
}