import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'roots-app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent {
  forgotPasswordForm: FormGroup = new FormGroup({});
  subs: Subscription = new Subscription();

  constructor(
    private router: Router,
  ) {}

  // Navigate to login when submitting
  onSubmit(): void {
    this.router.navigate(['/login']);
  }
}
