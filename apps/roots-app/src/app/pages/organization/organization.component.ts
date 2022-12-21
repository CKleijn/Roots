/* eslint-disable prefer-const */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@roots/data';
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
    organizationSubscription!: Subscription;
    loggedInUser!: User;
    participants!: User[];

    constructor(private organizationService: OrganizationService, private authService: AuthService) { }

    ngOnInit(): void {
        this.authSubscription = this.authService.getUserFromLocalStorage()
            .subscribe((user) => this.loggedInUser = user);
        this.organizationSubscription = this.organizationService.getParticipants(this.loggedInUser.organization.toString())
            .subscribe((participants) => this.participants = participants);
    }

    ngOnDestroy(): void {
        this.authSubscription.unsubscribe;
        this.organizationSubscription.unsubscribe;
    }
}
