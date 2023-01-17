import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@roots/data';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'roots-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  subs!: Subscription;
  submitted = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router, private spinner: NgxSpinnerService) {}

  // Create new form and get user from local storage when starting component
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      emailAddress: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });

    this.subs = this.authService
      .getUserFromLocalStorage()
      .subscribe((user: User) => {
        if (user) {
          this.router.navigate([
            `/organizations/${user.organization}/timeline`,
          ]);
        }
      });
  }

  // Show password instead of *****
  showPasswordToggle() {
    this.showPassword = !this.showPassword;
  }

  // Submit the form and redirect
  onSubmit(): void {
    this.spinner.show();

    if (this.loginForm.valid) {
      this.submitted = true;
      const emailAddress = this.loginForm.value.emailAddress;
      const password = this.loginForm.value.password;

      this.authService.login(emailAddress, password).subscribe((user) => {
        this.spinner.hide();
        if (user && !user.isVerified) {
          this.router.navigate([`/verification`], {
            queryParams: {
              emailAddress: user.emailAddress,
              userId: user._id.toString(),
            },
          });
        } else if (user) {
          this.router.navigate([
            `/organizations/${user.organization}/timeline`,
          ]);
        }
        this.submitted = false;
      });
    } else {
      this.submitted = false;

      this.spinner.hide();
    }
  }

  // Destroy all subscriptions
  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
}
