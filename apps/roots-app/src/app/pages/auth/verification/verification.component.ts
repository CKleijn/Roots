import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxOtpInputConfig } from 'ngx-otp-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'roots-app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss'],
})
export class VerificationComponent implements OnInit, OnDestroy {
  registerForm: FormGroup = new FormGroup({});
  subs: Subscription = new Subscription();
  code = 0;
  validInput = false;
  userId: string | undefined;
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
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
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
    console.log(this.emailAddress);

    this.spinner.show();

    setTimeout(() => {
      console.log('this is the first message');
      this.spinner.hide();
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  onSubmit(): void {
    console.log(this.code);
    console.log(this.userId);
    console.log(this.emailAddress);

    // if(this.code){

    // }
  }
}
