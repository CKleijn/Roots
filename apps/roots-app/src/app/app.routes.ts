import { Route } from '@angular/router';
import { LoggedInAuthGuard } from './pages/auth/auth.guards';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { EventDetailComponent } from './pages/event/detail/detail.component';
import { EventFormComponent } from './pages/event/form/form.component';
import { OrganizationComponent } from './pages/organization/organization.component';
import { TimelineComponent } from './pages/timeline/timeline.component';

export const appRoutes: Route[] = [
  //AUTH
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
    title: 'Inloggen',
  },
  {
    path: 'register',
    component: RegisterComponent,
    pathMatch: 'full',
    title: 'Registreren',
  },
  //TIMELINE
  {
    path: 'organizations/:organizationId/timeline',
    component: TimelineComponent,
    pathMatch: 'full',
    title: 'Tijdlijn',
    canActivate: [LoggedInAuthGuard]
  },
  // EVENTS
  {
    path: 'organizations/:organizationId/events/new',
    pathMatch: 'full',
    component: EventFormComponent,
    title: 'Gebeurtenis aanmaken',
    canActivate: [LoggedInAuthGuard],
  },
  {
    path: 'organizations/:organizationId/events/:eventId',
    pathMatch: 'full',
    component: EventDetailComponent,
    title: 'Gebeurtenis details',
    canActivate: [LoggedInAuthGuard],
  },
  {
    path: 'organizations/:organizationId/events/:eventId/edit',
    pathMatch: 'full',
    component: EventFormComponent,
    title: 'Gebeurtenis bewerken',
    canActivate: [LoggedInAuthGuard],
  },
  // ORGANIZATION
  {
    path: 'organizations/:organizationId',
    pathMatch: 'full',
    component: OrganizationComponent,
    title: 'Organisatie',
    canActivate: [LoggedInAuthGuard],
  },
  //FALLBACK
  { path: '**', redirectTo: 'login' },
];
