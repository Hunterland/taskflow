import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  /**
   * Permite acesso apenas para usuários autenticados
   * com role ADMIN.
   */
  if (authService.isAdmin()) {
    return true;
  }

  /**
   * Se o usuário não for admin, redireciona para o dashboard.
   * Isso evita expor a área administrativa para usuários comuns.
   */
  return router.createUrlTree(['/dashboard']);
};
