import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ProjectsService } from '../../../core/services/projects.service';
import type { ProjectResponseDto } from '../../../core/api/generated/model';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css',
})
export class ProjectDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private projectsService = inject(ProjectsService);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  errorMessage = '';
  project: ProjectResponseDto | null = null;
  projectId = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (!id) {
        this.errorMessage = 'Projeto não informado.';
        this.project = null;
        this.cdr.detectChanges();
        return;
      }

      this.projectId = id;
      void this.loadProject();
    });
  }

  async loadProject(): Promise<void> {
    if (!this.projectId) return;

    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    try {
      this.project = await this.projectsService.findOne(this.projectId);
    } catch (error) {
      console.error('Erro ao carregar projeto:', error);
      this.project = null;
      this.errorMessage = 'Não foi possível carregar os detalhes do projeto.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  retryLoadProject(): void {
    void this.loadProject();
  }

  goBack(): void {
    this.location.back();
  }

  goToProjects(): void {
    this.router.navigate(['/projects']);
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }
}
