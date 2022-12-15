import { Route } from '@angular/router';
import { LoggedInAuthGuard } from './pages/auth/auth.guards';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { TimelineComponent } from './pages/timeline/timeline.component';
import { EventComponent } from './pages/event/event.component';
import { EventFormComponent } from './pages/event/form/form.component';
import { EventDetailComponent } from './pages/event/event-detail/event-detail.component';

export const appRoutes: Route[] = [
  //TIMELINE
  { path: 'timeline', component: TimelineComponent, pathMatch: 'full', canActivate: [LoggedInAuthGuard] },
  //AUTH
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'register', component: RegisterComponent, pathMatch: 'full' },
  // EVENTS
  { path: 'events', pathMatch: 'full', component: EventComponent, canActivate: [LoggedInAuthGuard] },
  { path: 'events/new', pathMatch: 'full', component: EventFormComponent, canActivate: [LoggedInAuthGuard] },
  { path: 'events/:eventId', pathMatch: 'full', component: EventDetailComponent, canActivate: [LoggedInAuthGuard] },
  { path: 'events/:eventId/edit', pathMatch: 'full', component: EventFormComponent, canActivate: [LoggedInAuthGuard] },
  //FALLBACK
  { path: '**', redirectTo: 'login' },
];
