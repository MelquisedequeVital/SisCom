import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  private router = inject(Router);
  private auth = inject(AuthService);

  canActivate(): boolean {
    // currentUser é um signal; chamamos como função para obter valor
    const user = (this.auth as any).currentUser?.();

    if (user) {
      if (user.isAdmin) {
        this.router.navigate(['/admin']);
      } else if (user.isManager) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/chats']);
      }
      return false;
    }

    return true;
  }
}
