import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxOtpInputModule } from 'ngx-otp-input';
import { LoggedInAuthGuard } from './auth.guards';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerificationComponent } from './verification/verification.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxOtpInputModule,
  ],
  declarations: [LoginComponent, RegisterComponent, VerificationComponent],
  providers: [LoggedInAuthGuard],
  exports: [LoginComponent, RegisterComponent],
})
export class AuthModule {}
