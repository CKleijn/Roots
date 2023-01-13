import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'roots-app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPasswordForm: FormGroup = new FormGroup({});
  subs: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      emailAddress: new FormControl(null, [
        Validators.required,
        this.validEmail.bind(this),
      ]),
    });
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.spinner.show();
      const emailAddress = this.forgotPasswordForm.value.emailAddress;

      console.log(emailAddress);

      this.spinner.hide();
    }
  }

  validEmail(control: FormControl): { [s: string]: boolean } {
    const email = control.value;
    const regexp = new RegExp('^[^@]+@[^@]+\\.[^@]+$');
    if (regexp.test(email) !== true) {
      return { email: false };
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return null!;
    }
  }
}
