import { Route } from '@angular/router';
import { EventComponent } from './pages/event/event.component';
import { EventFormComponent } from './pages/event/form/form.component';
import { TimelineComponent } from './pages/timeline/timeline.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/timeline', pathMatch: 'full' },
  { path: 'timeline', pathMatch: 'full', component: TimelineComponent },
  { path: 'events', pathMatch: 'full', component: EventComponent },
  { path: 'events/new', pathMatch: 'full', component: EventFormComponent },
  { path: 'events/:eventId/edit', pathMatch: 'full', component: EventFormComponent },
];
