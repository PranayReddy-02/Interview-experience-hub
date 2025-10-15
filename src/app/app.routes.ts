import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { SubmitExperienceComponent } from './components/submit-experience/submit-experience';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'submit', component: SubmitExperienceComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];
