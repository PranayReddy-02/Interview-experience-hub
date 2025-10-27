import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('AuthGuard - Checking authentication');
    console.log('AuthGuard - Is authenticated:', this.authService.isAuthenticated());
    console.log('AuthGuard - Current user:', this.authService.getCurrentUser());

    if (this.authService.isAuthenticated()) {
      console.log('AuthGuard - Access granted');
      return true;
    }

    console.log('AuthGuard - Access denied, redirecting to login');
    // Store the attempted URL for redirecting
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });

    return false;
  }
}
