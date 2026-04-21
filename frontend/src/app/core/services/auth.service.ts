import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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
  private readonly storage = sessionStorage;

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(
    this.getStoredUser(),
  );

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          this.persistSession(response);
        }),
      );
  }

  register(userData: RegisterDto): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  refresh(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();

    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(
        tap((response) => {
          this.persistSession(response);
        }),
      );
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
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
    return !!this.getAccessToken();
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
  
  //  --- Private Methods ---
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