import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import nl from '@angular/common/locales/nl';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Injectable,
  LOCALE_ID,
  NgModule
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule, Title } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  RouterModule,
  RouterStateSnapshot,
  TitleStrategy
} from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { QuillModule } from 'ngx-quill';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { AuthModule } from './pages/auth/auth.module';
import { EventDetailComponent } from './pages/event/detail/detail.component';
import { EventFormComponent } from './pages/event/form/form.component';
import { OrganizationComponent } from './pages/organization/organization.component';
import { OrganizationModule } from './pages/organization/organization.module';
import { FilterComponent } from './pages/timeline/filter/filter.component';
import { TimelineComponent } from './pages/timeline/timeline.component';
import { NavComponent } from './shared/nav/nav.component';

registerLocaleData(nl);

@Injectable({ providedIn: 'root' })
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`Roots | ${title}`);
    }
  }
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    TimelineComponent,
    EventFormComponent,
    EventDetailComponent,
    OrganizationComponent,
    FilterComponent,
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
    MatDialogModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    QuillModule.forRoot(),
    MatChipsModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatSortModule,
    OrganizationModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'nl-NL',
    },
    { provide: TitleStrategy, useClass: TemplatePageTitleStrategy },
  ],
  bootstrap: [AppComponent],
  exports: [NavComponent, NgxSpinnerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
