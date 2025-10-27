import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, SignupCredentials } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  credentials: SignupCredentials = {
    name: '',
    email: '',
    password: '',
    phone: ''
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.credentials.name || !this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    if (this.credentials.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    console.log('Attempting signup with:', this.credentials.email);

    this.authService.signup(this.credentials).subscribe({
      next: (result) => {
        this.isLoading = false;
        console.log('Signup result:', result);
        if (result.success) {
          console.log('Signup successful:', result.user);
          this.successMessage = 'Account created successfully! You can now login.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = result.error || 'Signup failed';
          console.error('Signup failed:', result.error);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Signup error details:', error);
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else if (error.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'An error occurred during signup. Please check if the backend server is running.';
        }
      }
    });
  }
}
