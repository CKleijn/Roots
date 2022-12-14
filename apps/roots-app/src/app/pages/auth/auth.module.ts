import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoggedInAuthGuard } from './auth.guards';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
@NgModule({
  imports: [
    CommonModule, 
    RouterModule, 
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [LoginComponent, RegisterComponent],
  providers: [LoggedInAuthGuard],
  exports: [LoginComponent, RegisterComponent],

})
export class AuthModule {}