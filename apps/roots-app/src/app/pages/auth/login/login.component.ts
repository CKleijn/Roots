import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@roots/data';
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

  constructor(private authService: AuthService, private router: Router) {}

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

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.submitted = true;
      const emailAddress = this.loginForm.value.emailAddress;
      const password = this.loginForm.value.password;

      this.authService.login(emailAddress, password).subscribe((user) => {
        if (user && !user.isVerified) {
          this.router.navigate([`/verification/${user._id.toString()}`]);
        } else if (user) {
          this.router.navigate([
            `/organizations/${user.organization}/timeline`,
          ]);
        }
        this.submitted = false;
      });
    } else {
      this.submitted = false;
    }
  }

  showPasswordToggle() {
    this.showPassword = !this.showPassword;
  }
}
