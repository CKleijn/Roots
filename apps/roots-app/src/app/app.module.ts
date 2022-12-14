import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EventComponent } from './pages/event/event.component';
import { EventFormComponent } from './pages/event/form/form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent, 
    EventComponent,
    EventFormComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    HttpClientModule,
    FormsModule,
    BrowserModule,
    NgbModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    QuillModule.forRoot()
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
