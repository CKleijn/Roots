import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxOtpInputComponent, NgxOtpInputConfig } from 'ngx-otp-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'roots-app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss'],
})
export class VerificationComponent implements OnInit, OnDestroy {
  @ViewChild('ngxotp') ngxOtp: NgxOtpInputComponent | undefined;
  registerForm: FormGroup = new FormGroup({});
  subs: Subscription = new Subscription();
  code = 0;
  validInput = false;
  userId: string | undefined;
  canResendEmail = true;
  secondsUntilResend = 0;
  emailAddress: string | undefined;
  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 6,
    autofocus: true,
    classList: {
      inputBox: 'my-super-box-class',
      input: 'my-super-class',
      inputFilled: 'my-super-filled-class',
      inputDisabled: 'my-super-disable-class',
      inputSuccess: 'my-super-succes-class',
      inputError: 'my-super-error-class',
    },
  };
  paramSubscription: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.userId = params['userId'];
      this.emailAddress = params['emailAddress'];
    });
  }

  handleOtpChange(value: any): void {
    this.validInput = false;
  }

  handleFillEvent(value: any): void {
    this.code = value;
    this.validInput = true;
  }

  resendEmail() {
    this.spinner.show();

    this.authService
      .resendVerificationMail(this.emailAddress as string)
      .subscribe(() => {
        this.spinner.hide();
        this.countdown(30);
      });
  }

  countdown(sec: number) {
    sec--;
    const timer = setTimeout(() => {
      this.canResendEmail = false;
      this.secondsUntilResend = sec;
      this.countdown(sec);
    }, 1000);

    if (sec < 0) {
      clearTimeout(timer);
      this.canResendEmail = true;
    }
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  onSubmit(): void {
    this.spinner.show();

    this.authService
      .verifyAccount({
        userId: this.userId,
        verificationCode: this.code,
      })
      .subscribe((user) => {
        this.spinner.hide();

        if (user) {
          this.router.navigate([`/`]);
        } else {
          this.ngxOtp?.clear();
        }
      });
  }
}
