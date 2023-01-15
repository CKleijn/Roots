import { Route } from '@angular/router';
import { LoggedInAuthGuard } from './pages/auth/auth.guards';
import { ConfirmationComponent } from './pages/auth/confirmation/confirmation.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { VerificationComponent } from './pages/auth/verification/verification.component';
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
  {
    path: 'verification',
    component: VerificationComponent,
    pathMatch: 'full',
    title: 'Account verifiëren',
  },
  {
    path: 'forgot_password',
    component: ForgotPasswordComponent,
    pathMatch: 'full',
    title: 'Wachtwoord vergeten',
  },
  {
    path: 'password_reset/:tokenId',
    component: ResetPasswordComponent,
    pathMatch: 'full',
    title: 'Wachtwoord instellen',
  },

  {
    path: 'confirmation',
    component: ConfirmationComponent,
    pathMatch: 'full',
    title: 'Email is verstuurd',
  },

  //TIMELINE
  {
    path: 'organizations/:organizationId/timeline',
    component: TimelineComponent,
    pathMatch: 'full',
    title: 'Tijdlijn',
    canActivate: [LoggedInAuthGuard],
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
