import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { ProjectsService } from '../../core/services/projects.service';
import { AuthService } from '../../core/services/auth.service';
import type {
  CreateProjectDto,
  ProjectResponseDto,
  UpdateProjectDto,
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
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  searchTerm = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  creatingProject = false;
  updatingProject = false;
  deletingProjectId: number | null = null;

  isCreateModalOpen = false;
  isEditModalOpen = false;

  selectedProject: ProjectResponseDto | null = null;
  projects: ProjectResponseDto[] = [];

  createProjectForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.maxLength(1000)]],
  });

  editProjectForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.maxLength(1000)]],
  });

  ngOnInit(): void {
    void this.loadProjects();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get canCreateProjects(): boolean {
    return this.authService.canCreateProjects();
  }

  get canEditProjects(): boolean {
    return this.authService.canEditProjects();
  }

  get canDeleteProjects(): boolean {
    return this.authService.canDeleteProjects();
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

  get hasProjects(): boolean {
    return this.projects.length > 0;
  }

  get hasFilteredProjects(): boolean {
    return this.filteredProjects.length > 0;
  }

  applySearch(): void {
    this.searchTerm = this.searchTerm.trimStart();
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  async loadProjects(showLoader = true): Promise<void> {
    if (showLoader) {
      this.loading = true;
    }

    this.errorMessage = '';
    this.cdr.detectChanges();

    try {
      this.projects = await this.projectsService.findAll();
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      this.errorMessage = 'Não foi possível carregar os projetos.';
      this.projects = [];
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  openProject(project: ProjectResponseDto): void {
    this.router.navigate(['/projects', project.id]);
  }

  openCreateProject(): void {
    if (!this.canCreateProjects) return;

    this.clearMessages();

    this.createProjectForm.reset({
      name: '',
      description: '',
    });

    this.isCreateModalOpen = true;
    this.cdr.detectChanges();
  }

  closeCreateModal(): void {
    if (this.creatingProject) return;

    this.isCreateModalOpen = false;
    this.cdr.detectChanges();
  }

  async submitCreateProject(): Promise<void> {
    if (!this.canCreateProjects) return;

    if (this.createProjectForm.invalid) {
      this.createProjectForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.creatingProject = true;
    this.clearMessages();

    const formValue = this.createProjectForm.getRawValue();

    const payload: CreateProjectDto = {
      name: formValue.name.trim(),
      description: formValue.description.trim() || undefined,
    };

    try {
      await this.projectsService.create(payload);

      this.isCreateModalOpen = false;
      this.createProjectForm.reset({
        name: '',
        description: '',
      });

      await this.loadProjects(false);
      this.successMessage = 'Projeto criado com sucesso.';
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      this.errorMessage = 'Não foi possível criar o projeto.';
    } finally {
      this.creatingProject = false;
      this.cdr.detectChanges();
    }
  }

  openEditProject(project: ProjectResponseDto): void {
    if (!this.canEditProjects) return;

    this.clearMessages();
    this.selectedProject = project;

    this.editProjectForm.reset({
      name: String(project.name ?? ''),
      description: String(project.description ?? ''),
    });

    this.isEditModalOpen = true;
    this.cdr.detectChanges();
  }

  closeEditModal(): void {
    if (this.updatingProject) return;

    this.isEditModalOpen = false;
    this.selectedProject = null;
    this.cdr.detectChanges();
  }

  async submitEditProject(): Promise<void> {
    if (!this.canEditProjects) return;

    if (!this.selectedProject) {
      this.errorMessage = 'Nenhum projeto selecionado para edição.';
      this.cdr.detectChanges();
      return;
    }

    if (this.editProjectForm.invalid) {
      this.editProjectForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.updatingProject = true;
    this.clearMessages();

    const formValue = this.editProjectForm.getRawValue();

    const payload: UpdateProjectDto = {
      name: formValue.name.trim(),
      description: formValue.description.trim() || undefined,
    };

    try {
      await this.projectsService.update(String(this.selectedProject.id), payload);

      this.isEditModalOpen = false;
      this.selectedProject = null;

      await this.loadProjects(false);
      this.successMessage = 'Projeto atualizado com sucesso.';
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      this.errorMessage = 'Não foi possível atualizar o projeto.';
    } finally {
      this.updatingProject = false;
      this.cdr.detectChanges();
    }
  }

  editProject(project: ProjectResponseDto): void {
    this.openEditProject(project);
  }

  async deleteProject(project: ProjectResponseDto): Promise<void> {
    if (!this.canDeleteProjects) return;

    const confirmed = window.confirm(`Deseja realmente excluir o projeto "${project.name}"?`);

    if (!confirmed) return;

    this.clearMessages();
    this.deletingProjectId = Number(project.id);

    try {
      await this.projectsService.remove(String(project.id));
      await this.loadProjects(false);
      this.successMessage = 'Projeto excluído com sucesso.';
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      this.errorMessage = 'Não foi possível excluir o projeto.';
    } finally {
      this.deletingProjectId = null;
      this.cdr.detectChanges();
    }
  }

  retryLoadProjects(): void {
    void this.loadProjects();
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }
}
