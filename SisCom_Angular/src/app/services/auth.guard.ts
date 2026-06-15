import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private auth = inject(AuthService);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = (this.auth as any).currentUser?.();
    const requireAdmin = route.data && route.data['requireAdmin'] === true;
    const requireManager = route.data && route.data['requireManager'] === true;

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    if (requireAdmin && !user.isAdmin) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    if (requireManager && !(user.isAdmin || user.isManager)) {
      this.router.navigate(['/chats']);
      return false;
    }

    return true;
  }
}
