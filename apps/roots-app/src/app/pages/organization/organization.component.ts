/* eslint-disable prefer-const */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ILog, Organization, User } from '@roots/data';
import { Types } from 'mongoose';
import { ToastrService } from 'ngx-toastr';
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
  participantsSubscription!: Subscription;
  organizationSubscription!: Subscription;
  tagsSubscription!: Subscription;
  editSubscription!: Subscription;
  deleteSubscription!: Subscription;
  loggedInUser!: User;
  participants!: User[];
  selectedUser!: User;
  organization: Organization | undefined;
  // Select columns that needs to be showed
  displayedColumns: string[] = ['picture', 'name', 'emailAddress', 'createdAt', 'lastLogin', 'status'];
  displayedColumnsTag: string[] = ['tag', 'change'];
  tags!: Tag[];
  //edit
  editTagId!: string
  editTagName!: string
  //delete
  deleteTagId!: string
  deleteTagName!: string


  // LOG

  displayedColumnsLog: string[] = ['Gebruiker', 'Actie', 'Object', 'Wanneer'];
  dataSource: MatTableDataSource<ILog>;
  logSubscription!: Subscription;


  constructor(
    private organizationService: OrganizationService,
    private authService: AuthService,
    private tagService: TagService,
    private modalService: NgbModal,
    private router: Router,
    private toastrService: ToastrService
  ) {
      // get all logs
      const logs = this.organization?.logs;
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(logs);


   }

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
    // Get tags
    this.tagsSubscription = this.tagService.getAllTagsByOrganization(this.loggedInUser.organization.toString())
      .subscribe((tags) => this.tags = tags?.sort((a, b) => a.name.localeCompare(b.name)));
    // Get organization name
    this.organizationSubscription = this.organizationService.getById(this.loggedInUser.organization.toString())
      .subscribe((organization) => this.organization = organization);

    // get log
    this.logSubscription = this.organizationService.log(this.loggedInUser.organization.toString())
      .subscribe((log) => {this.dataSource = new MatTableDataSource(log.logs);
      console.log('ORG COMP ',log.logs)}
      )
    
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

  editModal(content: any, tagId: string, tagName: string) {
    this.editTagId = tagId;
    this.editTagName = tagName;
    this.modalService.open(content, { ariaLabelledBy: 'modal-tag-edit' })
  }

  deleteModal(content: any, tagId: string, tagName: string) {
    this.deleteTagId = tagId;
    this.deleteTagName = tagName;
    this.modalService.open(content, { ariaLabelledBy: 'modal-tag-delete' })
  }

  async editTag(newTag: string) {
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    let duplicate: boolean = false;

    for await (const tag of this.tags) {
      if (tag.name === newTag)
        duplicate = true;
    }

    if (!duplicate) {
      let updateTag: Tag = {
        _id: new Types.ObjectId(this.editTagId),
        name: newTag,
        organization: this.loggedInUser.organization.toString()
      }
      this.editSubscription = this.tagService.putTag(updateTag, this.editTagId).subscribe();
      this.modalService.dismissAll();
      this.organizationService.logCreate(this.loggedInUser, 'Gewijzigd', '(T) ' + updateTag.name).subscribe()

      this.ngOnInit();
    } else {
      this.toastrService.error('De gegeven tag naam is al in gebruik!', 'Tag niet gewijzigd!')
    }
  }

  deleteTag() {
    this.deleteSubscription = this.tagService.deleteTag(this.deleteTagId, this.loggedInUser.organization.toString()).subscribe();
    this.modalService.dismissAll();

    this.ngOnInit();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe;
    this.organizationSubscription?.unsubscribe;
    this.participantsSubscription?.unsubscribe;
    this.tagsSubscription?.unsubscribe;
    this.editSubscription?.unsubscribe;
    this.deleteSubscription?.unsubscribe;
    this.logSubscription?.unsubscribe;
  }
}
