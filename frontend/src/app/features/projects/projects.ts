import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

type ProjectStatus = 'ACTIVE' | 'IN_PROGRESS' | 'COMPLETED';
type StatusFilter = ProjectStatus | 'ALL';

interface Project {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  pendingTasks: number;
  teamMembers: number;
  updatedAt: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class ProjectsComponent {
  searchTerm = '';
  activeStatusFilter: StatusFilter = 'ALL';
  loading = false;

  projects: Project[] = [
    {
      id: 1,
      name: 'Portal do Cliente',
      description: 'Plataforma para acompanhamento de solicitações, documentos e comunicação com clientes.',
      status: 'ACTIVE',
      pendingTasks: 18,
      teamMembers: 4,
      updatedAt: '22 de abril de 2026',
    },
    {
      id: 2,
      name: 'App de Eventos',
      description: 'Sistema para cadastro, gerenciamento de inscrições e acompanhamento de eventos culturais.',
      status: 'IN_PROGRESS',
      pendingTasks: 9,
      teamMembers: 3,
      updatedAt: '20 de abril de 2026',
    },
    {
      id: 3,
      name: 'Landing Page Institucional',
      description: 'Página institucional com foco em apresentação de serviços, formulário de contato e SEO.',
      status: 'COMPLETED',
      pendingTasks: 0,
      teamMembers: 2,
      updatedAt: '18 de abril de 2026',
    },
  ];

  get filteredProjects(): Project[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.projects.filter((project) => {
      const matchesSearch =
        !term ||
        project.name.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term);

      const matchesStatus =
        this.activeStatusFilter === 'ALL' || project.status === this.activeStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  get totalProjects(): number {
    return this.filteredProjects.length;
  }

  applySearch(): void {
    this.searchTerm = this.searchTerm.trimStart();
  }

  setStatusFilter(filter: StatusFilter): void {
    this.activeStatusFilter = filter;
  }

  toggleFilters(): void {
    this.activeStatusFilter = this.activeStatusFilter === 'ALL' ? 'ACTIVE' : 'ALL';
  }

  openCreateProject(): void {
    console.log('Abrir modal/rota de novo projeto');
  }

  editProject(project: Project): void {
    console.log('Editar projeto', project);
  }

  deleteProject(project: Project): void {
    console.log('Excluir projeto', project);
  }

  getStatusLabel(status: ProjectStatus): string {
    switch (status) {
      case 'ACTIVE':
        return 'Ativo';
      case 'IN_PROGRESS':
        return 'Em andamento';
      case 'COMPLETED':
        return 'Concluído';
    }
  }

  getStatusClasses(status: ProjectStatus): string {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700';
      case 'IN_PROGRESS':
        return 'bg-amber-50 text-amber-700';
      case 'COMPLETED':
        return 'bg-slate-100 text-slate-700';
    }
  }
}
