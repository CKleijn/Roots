import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select'
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { AuthModule } from './pages/auth/auth.module';
import { EventDetailComponent } from './pages/event/detail/detail.component';
import { EventComponent } from './pages/event/event.component';
import { EventFormComponent } from './pages/event/form/form.component';
import { OrganizationModule } from './pages/organization/organization.module';
import { TimelineComponent } from './pages/timeline/timeline.component';
import { NavComponent } from './shared/nav/nav.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { OrganizationComponent } from './pages/organization/organization.component';
import { LOCALE_ID } from '@angular/core';
import nl from '@angular/common/locales/nl';
import { registerLocaleData } from '@angular/common';
registerLocaleData(nl);

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    TimelineComponent,
    EventComponent,
    EventFormComponent,
    EventDetailComponent,
    OrganizationComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    NgbModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      progressBar: true,
      preventDuplicates: true,
    }),
    AuthModule,
    ReactiveFormsModule,
    MatTableModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    QuillModule.forRoot(),
    MatChipsModule,
    MatIconModule,
    MatSelectModule,
    MatAutocompleteModule,
    OrganizationModule,
    InfiniteScrollModule,
  ],
  providers: [
    { 
      provide: LOCALE_ID, 
      useValue: "nl-NL" },
  ],
  bootstrap: [AppComponent],
  exports: [NavComponent],
})
export class AppModule { }