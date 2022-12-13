import { Route } from '@angular/router';
import { TimelineComponent } from './pages/timeline/timeline.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/timeline', pathMatch: 'full' },
  { path: 'timeline', component: TimelineComponent, pathMatch: 'full' },
];
