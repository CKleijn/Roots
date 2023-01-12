import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { OrganizationService } from '../../organization/organization.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'roots-app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss'],
})
export class VerificationComponent implements OnInit, OnDestroy {
  registerForm: FormGroup = new FormGroup({});
  subs: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private organizationService: OrganizationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    console.log('ngoninit');
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  onSubmit(): void {
    console.log('onsubmit');
  }
}
