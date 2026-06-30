import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Ajuste o caminho conforme sua estrutura

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica se existe um usuário logado (ex: lendo o signal currentUser)
  if (authService.currentUser()) { 
    return true;
  }

  // Se não estiver logado, redireciona para a página de login
  router.navigate(['/login']);
  return false;
};