import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { environment } from '../../../environments/environment';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);

  const isApiRequest = req.url.startsWith(environment.apiUrl);
  const isAuthRoute =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/refresh');

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthError = error.status === 401 || error.status === 403;
      const hasSession =
        !!authService.getAccessToken() || !!authService.getRefreshToken();

      if (isApiRequest && !isAuthRoute && isAuthError && hasSession) {
        notificationService.warning(
          'Sua sessão expirou. Faça login novamente.',
          'Sessão expirada',
        );

        authService.logout();
      }

      return throwError(() => error);
    }),
  );
};
