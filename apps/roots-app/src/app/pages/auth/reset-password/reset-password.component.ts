import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'roots-app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  resetPasswordForm: FormGroup = new FormGroup({});
  subs: Subscription = new Subscription();
  showPassword = false;
  showConfirmPassword = false;
  tokenId: string | undefined;
  paramSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}

  // Create form when starting up component
  ngOnInit(): void {
    this.resetPasswordForm = new FormGroup(
      {
        password: new FormControl(null, [
          Validators.required,
          this.validPassword.bind(this),
        ]),
        confirmPassword: new FormControl(null, [Validators.required]),
      },
      { validators: this.passwordMatchingValidatior }
    );

    this.paramSubscription = this.route.paramMap.subscribe(
      (params: ParamMap) => ((this.tokenId as any) = params.get('tokenId'))
    );
  }

  // Show password instead of *****
  showPasswordToggle() {
    return (this.showPassword = !this.showPassword);
  }

  // Show confirm password instead of *****
  showConfirmPasswordToggle() {
    return (this.showConfirmPassword = !this.showConfirmPassword);
  }

  // Check if password is valid
  validPassword(control: FormControl): { [s: string]: boolean } {
    const password = control.value;

    const regexp = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$'
    );

    if (regexp.test(password) !== true) {
      return { password: false };
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return null!;
    }
  }

  // Check if password and confirmPassword are matching
  passwordMatchingValidatior: ValidatorFn = (control: AbstractControl) => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password?.value !== confirmPassword?.value ||
      (password?.value === null && confirmPassword?.value === null)
    ) {
      confirmPassword?.setErrors({ notMatched: false });
    } else {
      confirmPassword?.setErrors(null);
    }
    return null;
  };

  // Submit form and reset password
  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      this.spinner.show();
      const password = this.resetPasswordForm.value.password;

      this.authService
        .resetPassword(this.tokenId as string, password)
        .subscribe(() => {
          this.spinner.hide();
          this.router.navigate(['/login']);
        });
    }
  }

  // Destroy all subscriptions
  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
}
