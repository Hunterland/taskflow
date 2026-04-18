import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Permite acesso apenas para usuários autenticados.
  if (authService.isAuthenticated()) {
    return true;
  }
  
  // Se o usuário não estiver autenticado, redireciona para a tela de login.
  return router.createUrlTree(['/login']);
};
