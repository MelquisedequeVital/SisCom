import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { UserService } from './user.service'; // Injetando o seu serviço!

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userServ = inject(UserService);

  private currentUserSignal = signal<User | null>(null);
  public currentUser = this.currentUserSignal.asReadonly();

  constructor() {
    this.checkSavedSession();
  }

  login(email: string, password: string, rememberMe: boolean): Observable<User> {
    // Em vez de ir à API, vasculhamos a lista que o UserService já tem em memória!
    const users = this.userServ.users();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      this.currentUserSignal.set(user);
      
      if (rememberMe) {
        localStorage.setItem('loggedUserId', user.id);
      } else {
        sessionStorage.setItem('loggedUserId', user.id);
      }

      // Retornamos um Observable simulando um pequeno atraso (delay)
      // apenas para o seu botão "Entrando..." girar de forma bonita na tela!
      return of(user).pipe(delay(800)); 
    } else {
      return throwError(() => new Error('Credenciais inválidas'));
    }
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('loggedUserId');
    sessionStorage.removeItem('loggedUserId');
  }

  private checkSavedSession() {
    const savedId = localStorage.getItem('loggedUserId') || sessionStorage.getItem('loggedUserId');
    
    if (savedId) {
      // Usamos o método do UserService para buscar o perfil salvo!
      this.userServ.getUserById(savedId).subscribe({
        next: (user) => {
          if (user) this.currentUserSignal.set(user);
        },
        error: () => this.logout()
      });
    }
  }
}
