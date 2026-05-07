import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthUser, UserRole } from '../models/auth-user.model';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private readonly storage: Storage = localStorage;

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  initializeSession(): Promise<void> {
    return new Promise((resolve) => {
      const accessToken = this.storage.getItem('accessToken');
      const refreshToken = this.storage.getItem('refreshToken');
      const storedUser = this.getStoredUser();

      if (accessToken && storedUser) {
        this.currentUserSubject.next(storedUser);
        resolve();
        return;
      }

      if (!accessToken && !refreshToken) {
        this.clearSession();
        resolve();
        return;
      }

      if (!storedUser) {
        this.clearSession();
      }

      resolve();
    });
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => this.persistSession(response)),
    );
  }

  register(userData: RegisterDto): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  refresh(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.clearSession();
      return throwError(() => new Error('Refresh token não encontrado.'));
    }

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap((response) => this.persistSession(response)),
    );
  }

  logout(reason?: 'session-expired' | 'manual'): void {
    this.clearSession();
    this.router.navigate(['/login'], {
      queryParams: reason ? { reason } : undefined,
    });
  }

  getAccessToken(): string | null {
    return this.storage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return this.storage.getItem('refreshToken');
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getCurrentUser();
  }

  hasRole(role: UserRole): boolean {
    return this.getCurrentUser()?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isUser(): boolean {
    return this.hasRole('USER');
  }

  canManageProjects(): boolean {
    return this.isAdmin();
  }

  canCreateProjects(): boolean {
    return this.isAdmin();
  }

  canEditProjects(): boolean {
    return this.isAdmin();
  }

  canDeleteProjects(): boolean {
    return this.isAdmin();
  }

  private persistSession(response: LoginResponse): void {
    this.storage.setItem('accessToken', response.accessToken);
    this.storage.setItem('refreshToken', response.refreshToken);
    this.storage.setItem('currentUser', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  private clearSession(): void {
    this.storage.removeItem('accessToken');
    this.storage.removeItem('refreshToken');
    this.storage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  private getStoredUser(): AuthUser | null {
    const storedUser = this.storage.getItem('currentUser');

    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      this.storage.removeItem('currentUser');
      return null;
    }
  }
}
