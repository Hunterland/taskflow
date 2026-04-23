import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { environment } from '../../../../environments/environment';


interface ProjectDetails {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css',
})
export class ProjectDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  project: ProjectDetails | null = null;
  projectId: string | null = null;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          this.projectId = id;

          if (!id) {
            this.isLoading = false;
            this.errorMessage = 'ID do projeto não informado.';
            return of(null);
          }

          this.isLoading = true;
          this.errorMessage = '';

          return this.http.get<ProjectDetails>(`${environment.apiUrl}/projects/${id}`);
        }),
      )
      .subscribe({
        next: (project) => {
          this.project = project;
          this.isLoading = false;
        },
        error: (error) => {
          this.project = null;
          this.isLoading = false;
          this.errorMessage =
            error?.error?.message || 'Não foi possível carregar os detalhes do projeto.';
        },
      });
  }
}
