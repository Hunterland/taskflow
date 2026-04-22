import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  protected authService = inject(AuthService);
  private http = inject(HttpClient);

  ngOnInit(): void {
    this.http.get(`${environment.apiUrl}/users/me`).subscribe({
      next: (response) => {
        console.log('Usuário autenticado:', response);
      },
      error: (error) => {
        console.error('Erro ao buscar /users/me:', error);
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
