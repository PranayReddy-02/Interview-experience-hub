import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { SubmitExperienceComponent } from './components/submit-experience/submit-experience';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExperienceDetailComponent } from './components/experience-detail/experience-detail';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'submit',
    component: SubmitExperienceComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'experiences/:id',
    component: ExperienceDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
