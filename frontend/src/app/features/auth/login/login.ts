import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';  // ← IMPORTAÇÃO FALTANTE
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);  // ← FUNCIONA COM O IMPORT

  isLoading = false;
  errorMessage = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({
      email: email ?? '',
      password: password ?? '',
    }).subscribe({
      next: (response) => {
        this.isLoading = false;

        this.toastr.success('Login realizado com sucesso!', 'Sucesso ✅');
        console.log('✅ Login realizado com sucesso!', response);

        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;

        const msg = error?.error?.message || 'Email ou senha inválidos.';
        this.toastr.error(msg, 'Erro no login ❌');
        console.error('❌ Falha no login:', error);
        this.errorMessage = msg;
      },
    });
  }
}
