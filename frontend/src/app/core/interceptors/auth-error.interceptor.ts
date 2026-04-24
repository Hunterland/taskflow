import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { environment } from '../../../environments/environment';

let isLoggingOut = false;

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
      const isUnauthorized = error.status === 401;
      const hasSession = !!authService.getAccessToken() || !!authService.getCurrentUser();

      if (isApiRequest && !isAuthRoute && isUnauthorized && hasSession && !isLoggingOut) {
        isLoggingOut = true;

        setTimeout(() => {
          notificationService.warning(
            'Sua sessão expirou. Faça login novamente.',
            'Sessão expirada',
          );
          authService.logout('session-expired');
          isLoggingOut = false;
        });
      }

      return throwError(() => error);
    }),
  );
};
