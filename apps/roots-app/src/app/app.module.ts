import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { AuthModule } from './pages/auth/auth.module';
import { TimelineComponent } from './pages/timeline/timeline.component';
import { NavComponent } from './shared/nav/nav.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    TimelineComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      progressBar: true,
      preventDuplicates: true,
    }),
    AuthModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [NavComponent]
})
export class AppModule {}
