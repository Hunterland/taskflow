import { Component, EventEmitter, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
})
export class HeaderComponent {
  @Output() menuToggle = new EventEmitter<void>();

  private router = inject(Router);
  protected authService = inject(AuthService);

  protected get pageTitle(): string {
    const url = this.router.url;

    if (url.startsWith('/projects')) return 'Projetos';
    if (url.startsWith('/tasks')) return 'Tarefas';
    if (url.startsWith('/admin')) return 'Admin';
    return 'Dashboard';
  }
}