/* eslint-disable prefer-const */
import { Component, OnDestroy, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Organization, User } from '@roots/data';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { OrganizationService } from './organization.service';

@Component({
  selector: 'roots-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
})
export class OrganizationComponent implements OnInit, OnDestroy {
  authSubscription!: Subscription;
  participantsSubscription!: Subscription;
  organizationSubscription!: Subscription;
  loggedInUser!: User;
  participants!: User[];
  selectedUser!: User;
  organization: Organization | undefined;
  // Select columns that needs to be showed
  displayedColumns: string[] = [
    'picture',
    'name',
    'emailAddress',
    'createdAt',
    'lastLogin',
    'status',
  ];

  constructor(
    private organizationService: OrganizationService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

    ngOnInit(): void {
        this.authSubscription = this.authService.getUserFromLocalStorage()
            .subscribe((user) => this.loggedInUser = user);
        this.participantsSubscription = this.organizationService.getParticipants(this.loggedInUser.organization.toString())
            .subscribe((participants) => {
                this.participants = participants;
                // Get foreach participant their initials
                participants.forEach(participant => {
                    let last = participant.lastname.split(" ");
                    participant.initials = participant.firstname[0].toUpperCase() + last[last.length - 1][0].toUpperCase();
                });
            });
        // Get organization name
        this.organizationSubscription = this.organizationService.getById(this.loggedInUser.organization.toString())
            .subscribe((organization) => this.organization = organization);
    }
    
      changeStatus(id: string) {
    this.modalService.dismissAll();
    this.organizationService.status(id).subscribe((user) => {
      if (user) {
        this.ngOnInit();
      }
    });
  }

  open(content: any, selectedUser: User) {
    this.selectedUser = selectedUser;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

    ngOnDestroy(): void {
        this.authSubscription.unsubscribe;
        this.organizationSubscription.unsubscribe;
        this.participantsSubscription.unsubscribe;
    }
}
