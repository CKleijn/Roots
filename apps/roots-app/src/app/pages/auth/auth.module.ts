import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxOtpInputModule } from 'ngx-otp-input';
import { LoggedInAuthGuard } from './auth.guards';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
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
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerificationComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ConfirmationComponent,
  ],
  providers: [LoggedInAuthGuard],
  exports: [LoginComponent, RegisterComponent],
})
export class AuthModule {}
