import { Component, inject, signal, OnInit, effect } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [],
  templateUrl: './admin-header.html',
})
export class AdminHeader implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  
  public isAdminRoute = signal<boolean>(false);
  public isMenuOpen = signal<boolean>(false);
  public userInitials = signal<string>('US');

  constructor() {
    effect(() => {
      // Lê o Signal do AuthService
      const user = this.authService.currentUser();
      
      const email = user?.email || 'admin.usuario@cehap.pb.gov.br';
      
      this.userInitials.set(this.getInitialsFromEmail(email));
    });
  }

  ngOnInit() {
    this.checkRoute(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkRoute(event.urlAfterRedirects || event.url);
    });
  }

  private checkRoute(url: string) {
    this.isAdminRoute.set(url.includes('/admin'));
  }

  private getInitialsFromEmail(email: string): string {
    if (!email) return 'US';
    
    const namePart = email.split('@')[0];
    const parts = namePart.split('.');
    
    if (parts.length > 1) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    
    return namePart.substring(0, 2).toUpperCase();
  }

  public toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }

  public logout() {
    this.authService.logout();
    this.isMenuOpen.set(false);
    this.router.navigate(['/login']);
  }
}