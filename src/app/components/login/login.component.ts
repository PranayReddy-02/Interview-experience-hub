import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService, LoginCredentials } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  credentials: LoginCredentials = {
    email: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';
  returnUrl = '/';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    console.log('Attempting login with:', this.credentials.email);

    this.authService.login(this.credentials).subscribe({
      next: (result) => {
        this.isLoading = false;
        console.log('Login result:', result);
        if (result.success) {
          console.log('Login successful:', result.user);
          console.log('Token received:', result.token);
          console.log('Navigating to:', this.returnUrl);
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.errorMessage = result.error || 'Login failed';
          console.error('Login failed:', result.error);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error details:', error);
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else if (error.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'An error occurred during login. Please check if the backend server is running.';
        }
      }
    });
  }

  // Demo credentials helper
  fillDemoCredentials(): void {
    this.credentials.email = 'user@example.com';
    this.credentials.password = 'password';
  }

  // Admin credentials helper
  fillAdminCredentials(): void {
    this.credentials.email = 'admin@company.com';
    this.credentials.password = 'admin123';
  }

  // Test credentials helper
  fillTestCredentials(): void {
    this.credentials.email = 'test@gmail.com';
    this.credentials.password = 'test123';
  }
}
