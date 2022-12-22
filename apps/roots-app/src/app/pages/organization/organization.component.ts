/* eslint-disable prefer-const */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '@roots/data';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Tag } from '../tag/tag.model';
import { TagService } from '../tag/tag.service';
import { OrganizationService } from './organization.service';

@Component({
    selector: 'roots-organization',
    templateUrl: './organization.component.html',
    styleUrls: ['./organization.component.scss'],
})
export class OrganizationComponent implements OnInit, OnDestroy {

    authSubscription!: Subscription;
    organizationSubscription!: Subscription;
    tagsSubscription!:Subscription;
    loggedInUser!: User;
    participants!: User[];
    tags!:Tag[];

    //edit
    editTagId?:string
    editTagName?:string
    //delete
    deleteTagId?:string

    constructor(private organizationService: OrganizationService, private authService: AuthService, private tagService:TagService, private modalService: NgbModal) { }

    ngOnInit(): void {
        this.authSubscription = this.authService.getUserFromLocalStorage()
            .subscribe((user) => this.loggedInUser = user);
        this.organizationSubscription = this.organizationService.getParticipants(this.loggedInUser.organization.toString())
            .subscribe((participants) => this.participants = participants);
        this.tagsSubscription = this.tagService.getAllTagsByOrganization(this.loggedInUser.organization.toString())
            .subscribe((tags) => this.tags = tags);
        
    }

    ngOnDestroy(): void {
        this.authSubscription.unsubscribe;
        this.organizationSubscription.unsubscribe;
        this.tagsSubscription.unsubscribe;
    }

    editModal(content:any,tagId:string,tagName:string) {
        this.editTagId=tagId;
        this.editTagName=tagName;
        this.modalService.open(content, { ariaLabelledBy: 'modal-tag-edit' })
    }
    deleteModal(content:any,tagId:string,tagName:string) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-tag-delete' })
    }

    editTag() {
        console.log('edit Tag')
    }
}
