import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

type NavItem = {
  label: string;
  path: string;
  adminOnly?: boolean;
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();

  protected authService = inject(AuthService);

  protected navItems = computed<NavItem[]>(() => {
    const items: NavItem[] = [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Projetos', path: '/projects' },
      { label: 'Tarefas', path: '/tasks' },
      { label: 'Admin', path: '/admin', adminOnly: true },
    ];

    return items.filter((item) => !item.adminOnly || this.authService.isAdmin());
  });

  protected onNavigate(): void {
    this.closeSidebar.emit();
  }

  protected logout(): void {
    this.authService.logout();
  }
}
