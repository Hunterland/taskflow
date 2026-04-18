import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const guestGuard = (): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Permite acesso apenas para usuários não autenticados.
  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/dashboard']);
  }
   
  // Se o usuário estiver autenticado, redireciona para o dashboard.
  return true;
};