import { Routes } from '@angular/router';

// Guards
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';

// Páginas públicas
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';

// Layout da área autenticada
import { DashboardLayoutComponent } from './shared/components/dashboard-layout/dashboard-layout';

// Páginas protegidas
import { HomeComponent } from './features/dashboard/home/home';
import { AdminHomeComponent } from './features/admin/admin-home/admin-home';
import { ProjectsComponent } from './features/projects/projects';

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
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [guestGuard],
  },

  /**
   * Área autenticada com layout compartilhado.
   * O header/sidebar ficam fixos no DashboardLayoutComponent
   * e as páginas internas são renderizadas no router-outlet.
   */
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      /**
       * Dashboard principal
       */
      {
        path: 'dashboard',
        component: HomeComponent,
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects/projects').then((m) => m.ProjectsComponent),
      },
      {
        path: 'projects/:id',
        loadComponent: () =>
          import('./features/projects/project-details/project-details').then(
            (m) => m.ProjectDetailsComponent,
          ),
      },
      /**
       * Área administrativa
       */
      {
        path: 'admin',
        component: AdminHomeComponent,
        canActivate: [adminGuard],
      },

      /**
       * Redirecionamento interno opcional:
       * se no futuro quiser mandar o usuário autenticado
       * para /dashboard ao acessar a raiz protegida.
       */
      // {
      //   path: '',
      //   redirectTo: 'dashboard',
      //   pathMatch: 'full',
      // },
    ],
  },

  /**
   * Rota coringa
   * Deve sempre ficar por último, pois captura qualquer URL não mapeada.
   */
  {
    path: '**',
    redirectTo: 'login',
  },
];
