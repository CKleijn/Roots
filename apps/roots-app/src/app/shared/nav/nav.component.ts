import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@roots/data';
import { Subscription } from 'rxjs';
import { AuthService } from '../../pages/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'roots-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  userAuthenticated!: boolean;
  userSubscription!: Subscription;
  localUserSubscription!: Subscription;
  currentUser: User | undefined;

  constructor(
    private authService: AuthService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) {}

  // Get current user when loading the component
  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(
      (user) => (this.currentUser = user)
    );
    this.localUserSubscription = this.authService
      .getUserFromLocalStorage()
      .subscribe((user) => (this.currentUser = user));
  }

  // Open modal
  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  // Close modal and log out
  logout() {
    this.spinner.show();

    this.modalService.dismissAll();
    this.authService.logout();

    this.spinner.hide();
  }

  // Destroy all subscriptions
  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe;
    this.localUserSubscription?.unsubscribe;
  }
}
