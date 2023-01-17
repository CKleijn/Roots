import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Types } from 'mongoose';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { OrganizationService } from '../../organization/organization.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'roots-app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup = new FormGroup({});
  subs: Subscription = new Subscription();
  createOrganization = false;
  showPassword = false;
  showConfirmPassword = false;
  emailDomainInput = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private organizationService: OrganizationService,
    private spinner: NgxSpinnerService
  ) {}

  // Create register form when starting up the component
  ngOnInit(): void {
    this.registerForm = new FormGroup(
      {
        firstname: new FormControl(null, [Validators.required]),
        lastname: new FormControl(null, [Validators.required]),
        emailAddress: new FormControl(null, [
          Validators.required,
          this.validEmail.bind(this),
        ]),
        password: new FormControl(null, [
          Validators.required,
          this.validPassword.bind(this),
        ]),
        confirmPassword: new FormControl(null, [Validators.required]),
      },
      { validators: this.passwordMatchingValidatior }
    );
  }

  // Show organization form
  toggleCreateOrganization() {
    if (this.createOrganization) {
      this.registerForm.removeControl('organizationName');
      this.registerForm.removeControl('emailDomain');
    } else {
      this.registerForm.addControl(
        'organizationName',
        new FormControl(null, [Validators.required])
      );
      this.registerForm.addControl(
        'emailDomain',
        new FormControl({ value: this.emailDomainInput, disabled: true })
      );
    }

    this.createOrganization = !this.createOrganization;
  }

  // Show password instead of *****
  showPasswordToggle() {
    return (this.showPassword = !this.showPassword);
  }

  // Show confirm password instead of *****
  showConfirmPasswordToggle() {
    return (this.showConfirmPassword = !this.showConfirmPassword);
  }

  // Check if email is valid
  validEmail(control: FormControl): { [s: string]: boolean } {
    const email = control.value;
    const regexp = new RegExp('^[^@]+@[^@]+\\.[^@]+$');
    if (regexp.test(email) !== true) {
      this.emailDomainInput = '';
      return { email: false };
    } else {
      this.emailDomainInput = email.split('@').at(1);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return null!;
    }
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

  // Submit form and create user - and also organization if checkbox is checked
  onSubmit(): void {
    this.spinner.show();
    if (this.registerForm.valid && !this.createOrganization) {
      this.authService.register(this.registerForm.value).subscribe((user) => {
        this.spinner.hide();
        if (user) {
          this.router.navigate([`/verification`], {
            queryParams: {
              emailAddress: user.emailAddress,
              userId: user._id.toString(),
            },
          });
        }
      });
    } else if (this.registerForm.valid && this.createOrganization) {
      //create organization object
      const organization = {
        _id: new Types.ObjectId(),
        name: this.registerForm.value.organizationName,
        emailDomain: this.emailDomainInput,
        events: [],
        tags: [],
        logs:[]
      };

      //remove unneeded value, that's not needed for user object
      delete this.registerForm.value.confirmPassword;
      delete this.registerForm.value.organizationName;

      //create user object from left over values
      const user = {
        ...this.registerForm.value,
      };

      this.organizationService
        .create(organization)
        .subscribe((organization) => {
          if (organization) {
            this.authService.register(user).subscribe((user) => {
              this.spinner.hide();
              if (user) {
                this.router.navigate([`/verification`], {
                  queryParams: {
                    emailAddress: user.emailAddress,
                    userId: user._id.toString(),
                  },
                });
              }
            });
          } else {
            this.spinner.hide();
          }
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
