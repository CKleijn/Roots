import { Route } from '@angular/router';
import { LoggedInAuthGuard } from './pages/auth/auth.guards';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { TimelineComponent } from './pages/timeline/timeline.component';

export const appRoutes: Route[] = [
  //TIMELINE
  { path: 'timeline', component: TimelineComponent, pathMatch: 'full', canActivate: [LoggedInAuthGuard] },
  //AUTH
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'register', component: RegisterComponent, pathMatch: 'full' },
  //FALLBACK
  { path: '**', redirectTo: 'login' },
];
