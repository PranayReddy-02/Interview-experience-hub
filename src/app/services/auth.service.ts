import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface User {
  _id: string;
  email: string;
  name: string;
  role?: string;
  phone?: string;
  linkedinProfile?: string;
  degree?: string;
  branch?: string;
  college?: string;
  experience?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  linkedinProfile?: string;
  degree?: string;
  branch?: string;
  college?: string;
  experience?: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in (from localStorage)
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('currentUser');

    if (token && savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginCredentials): Observable<{ success: boolean; user?: User; token?: string; error?: string }> {
    console.log('AuthService - Attempting login for:', credentials.email);
    return this.http.post<{ message: string; token: string; user: User }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('AuthService - Login response received:', response);
        }),
        map(response => ({
          success: true,
          user: response.user,
          token: response.token
        })),
        tap(response => {
          console.log('AuthService - Processing login response:', response);
          if (response.token) {
            console.log('AuthService - Storing token and user data');
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
            console.log('AuthService - User state updated');
          } else {
            console.log('AuthService - No token in response');
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  register(userData: RegisterData): Observable<{ success: boolean; user?: User; token?: string; error?: string }> {
    return this.http.post<{ message: string; token: string; user: User }>(`${this.apiUrl}/register`, userData)
      .pipe(
        map(response => ({
          success: true,
          user: response.user,
          token: response.token
        })),
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  signup(credentials: SignupCredentials): Observable<{ success: boolean; user?: User; token?: string; error?: string }> {
    return this.http.post<{ message: string; token: string; user: User }>(`${this.apiUrl}/register`, credentials)
      .pipe(
        map(response => ({
          success: true,
          user: response.user,
          token: response.token
        })),
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null && !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user !== null && user.role === 'admin';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getProfile(): Observable<User> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/profile`)
      .pipe(
        map(response => response.user),
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<{ user: User }>(`${this.apiUrl}/profile`, userData)
      .pipe(
        map(response => response.user),
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  getUserExperiences(page: number = 1, limit: number = 10): Observable<any> {
    const token = this.getToken();
    console.log('AuthService - Getting user experiences, token:', token ? 'present' : 'missing');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.get(`${this.apiUrl}/experiences?page=${page}&limit=${limit}`, { headers });
  }

  getUserDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.error && error.error.errors) {
      errorMessage = error.error.errors.map((err: any) => err.msg).join(', ');
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => ({
      success: false,
      error: errorMessage
    }));
  }
}
