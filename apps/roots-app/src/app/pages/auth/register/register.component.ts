import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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

  constructor(private authService: AuthService, private router: Router) {}

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

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.createOrganization) {
      this.authService.register(this.registerForm.value).subscribe((user) => {
        if (user) {
          this.router.navigate(['/']);
        }
      });
    } else if (this.registerForm.valid && this.createOrganization) {
      //create organization object
      const organization = {
        name: this.registerForm.value.organizationName,
        emailDomain: this.emailDomainInput,
      };

      console.log(organization);

      //remove unneeded value, that's not needed for user object
      delete this.registerForm.value.confirmPassword;
      delete this.registerForm.value.organizationName;

      //create user object from left over values
      const user = {
        ...this.registerForm.value,
      };

      console.log(user);
    }
  }

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

  showPasswordToggle() {
    return (this.showPassword = !this.showPassword);
  }

  showConfirmPasswordToggle() {
    return (this.showConfirmPassword = !this.showConfirmPassword);
  }
}
