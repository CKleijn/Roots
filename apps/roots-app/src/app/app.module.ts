import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavComponent } from './shared/nav/nav.component';
import { TimelineComponent } from './pages/timeline/timeline.component';

@NgModule({
  declarations: [AppComponent, NavComponent, TimelineComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    NgbModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      progressBar: true,
      preventDuplicates: true
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
