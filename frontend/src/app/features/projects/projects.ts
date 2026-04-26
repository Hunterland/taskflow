import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { ProjectsService } from '../../core/services/projects.service';
import type {
  CreateProjectDto,
  ProjectResponseDto,
} from '../../core/api/generated/model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class ProjectsComponent implements OnInit {
  private projectsService = inject(ProjectsService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  searchTerm = '';
  loading = false;
  errorMessage = '';
  creatingProject = false;
  isCreateModalOpen = false;

  projects: ProjectResponseDto[] = [];

  createProjectForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.maxLength(1000)]],
  });

  ngOnInit(): void {
    void this.loadProjects();
  }

  get filteredProjects(): ProjectResponseDto[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.projects.filter((project) => {
      const name = String(project.name ?? '').toLowerCase();
      const description = String(project.description ?? '').toLowerCase();

      return !term || name.includes(term) || description.includes(term);
    });
  }

  get totalProjects(): number {
    return this.filteredProjects.length;
  }

  applySearch(): void {
    this.searchTerm = this.searchTerm.trimStart();
  }

  async loadProjects(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    try {
      const projects = await this.projectsService.findAll();
      this.projects = projects;
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      this.errorMessage = 'Não foi possível carregar os projetos.';
      this.projects = [];
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  openCreateProject(): void {
    this.createProjectForm.reset({
      name: '',
      description: '',
    });
    this.isCreateModalOpen = true;
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  closeCreateModal(): void {
    if (this.creatingProject) return;
    this.isCreateModalOpen = false;
    this.cdr.detectChanges();
  }

  async submitCreateProject(): Promise<void> {
    if (this.createProjectForm.invalid) {
      this.createProjectForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.creatingProject = true;
    this.errorMessage = '';

    const formValue = this.createProjectForm.getRawValue();

    const payload: CreateProjectDto = {
      name: formValue.name.trim(),
      description: formValue.description.trim() || undefined,
    };

    try {
      const createdProject = await this.projectsService.create(payload);
      this.projects = [createdProject, ...this.projects];
      this.isCreateModalOpen = false;
      this.createProjectForm.reset({
        name: '',
        description: '',
      });
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      this.errorMessage = 'Não foi possível criar o projeto.';
    } finally {
      this.creatingProject = false;
      this.cdr.detectChanges();
    }
  }

  editProject(project: ProjectResponseDto): void {
    this.router.navigate(['/projects', project.id, 'edit']);
  }

  async deleteProject(project: ProjectResponseDto): Promise<void> {
    const confirmed = window.confirm(
      `Deseja realmente excluir o projeto "${project.name}"?`,
    );

    if (!confirmed) return;

    try {
      await this.projectsService.remove(String(project.id));
      this.projects = this.projects.filter((item) => item.id !== project.id);
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      this.errorMessage = 'Não foi possível excluir o projeto.';
    } finally {
      this.cdr.detectChanges();
    }
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }
}
