import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginCredentials): Observable<{ success: boolean; user?: User; error?: string }> {
    // Simple mock authentication - in real app, this would call backend API
    return of(this.authenticateUser(credentials)).pipe(delay(1000));
  }

  private authenticateUser(credentials: LoginCredentials): { success: boolean; user?: User; error?: string } {
    // Mock users for demo
    const mockUsers = [
      { id: '1', email: 'user@example.com', password: 'password', name: 'Demo User' },
      { id: '2', email: 'admin@company.com', password: 'admin123', name: 'Admin User' },
      { id: '3', email: 'test@gmail.com', password: 'test123', name: 'Test User' }
    ];

    const user = mockUsers.find(u => u.email === credentials.email && u.password === credentials.password);

    if (user) {
      const authenticatedUser: User = {
        id: user.id,
        email: user.email,
        name: user.name
      };

      // Save to localStorage and update subject
      localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
      this.currentUserSubject.next(authenticatedUser);

      return { success: true, user: authenticatedUser };
    } else {
      return { success: false, error: 'Invalid email or password' };
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}