import { Routes } from '@angular/router';

// Guards
import { authGuard } from './core/guards/auth.guard';
// import { adminGuard } from './core/guards/admin.guard';

// Páginas públicas
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';

// Páginas protegidas
import { HomeComponent } from './features/dashboard/home/home';
// import { AdminHomeComponent } from './features/admin/admin-home/admin-home';

export const routes: Routes = [
  /**
   * Redirecionamento inicial da aplicação.
   * Ao acessar a raiz "/", o usuário é enviado para a tela de login.
   */
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  /**
   * Rotas públicas
   * Não exigem autenticação.
   */
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },

  /**
   * Rotas protegidas
   * Exigem usuário autenticado.
   */
  {
    path: 'dashboard',
    component: HomeComponent,
    canActivate: [authGuard],
  },

  /**
   * Rotas administrativas
   * Exemplo para uso futuro com autenticação + role ADMIN.
   *
   * Descomentar quando a área admin for criada.
   */
  // {
  //   path: 'admin',
  //   component: AdminHomeComponent,
  //   canActivate: [authGuard, adminGuard],
  // },

  /**
   * Rota coringa
   * Deve sempre ficar por último, pois captura qualquer URL não mapeada.
   */
  {
    path: '**',
    redirectTo: 'login',
  },
];
