/* eslint-disable prefer-const */
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ILog, Organization, User } from '@roots/data';
import { Types } from 'mongoose';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { elementAt, Subscription, tap } from 'rxjs';
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
  statusSubscription!: Subscription;
  logSubscription!: Subscription;
  loggedInUser!: User;
  participants!: User[];
  selectedUser!: User;
  organization: Organization | undefined;
  displayedColumns: string[] = [
    'picture',
    'name',
    'emailAddress',
    'createdAt',
    'lastLogin',
    'status',
  ];
  displayedColumnsTag: string[] = ['tag', 'change'];
  tags!: Tag[];
  //edit
  editTagId!: string
  editTagName!: string
  //delete
  deleteTagId!: string
  deleteTagName!: string
  //log paginator and sort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort! : MatSort; 
  // create datasource
  dataSource = new MatTableDataSource<ILog>;
  logs:ILog[] = [];
  displayedColumnsLog: string[] = ['editor', 'action', 'object', 'logStamp'];

  constructor(
    private organizationService: OrganizationService,
    private authService: AuthService,
    private tagService: TagService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  // Load everything when start up component
  ngOnInit(): void {
    this.spinner.show();
    // Get current user
    this.authSubscription = this.authService
      .getUserFromLocalStorage()
      .subscribe((user) => (this.loggedInUser = user));
    // Get participants
    this.participantsSubscription = this.organizationService
      .getParticipants(this.loggedInUser.organization.toString())
      .subscribe((participants) => {
        this.participants = participants;
        // Get foreach participant their initials
        participants.forEach((participant) => {
          let last = participant.lastname.split(' ');
          participant.initials =
            participant.firstname[0].toUpperCase() +
            last[last.length - 1][0].toUpperCase();
        });
      });
    // Get tags
    this.tagsSubscription = this.tagService
      .getAllTagsByOrganization(this.loggedInUser.organization.toString())
      .subscribe(
        (tags) =>
          (this.tags = tags?.sort((a, b) => a.name.localeCompare(b.name)))
      );
    // Get organization name
    this.organizationSubscription = this.organizationService
      .getById(this.loggedInUser.organization.toString())
      .subscribe((organization) => (this.organization = organization, this.spinner.hide()));

      // get log items
      this.logSubscription = this.organizationService.log(this.loggedInUser.organization.toString())
      .subscribe((log) => { 
        //set the retrieved logs as the table's data source
        this.logs = log.logs;
        this.dataSource.data = log.logs; 

        // couple paginator and sort to datasource 
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    }
  
  // Open modal
  open(content: any, selectedUser: User) {
    this.selectedUser = selectedUser;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  // Change status of user
  changeStatus(id: string) {
    this.spinner.show();

    this.modalService.dismissAll();
    this.statusSubscription = this.organizationService
      .status(id)
      .subscribe((user) => {
        if (user) {
          this.ngOnInit();
        }

        this.spinner.hide();
      });
  }

  // Edit modal
  editModal(content: any, tagId: string, tagName: string) {
    this.editTagId = tagId;
    this.editTagName = tagName;
    this.modalService.open(content, { ariaLabelledBy: 'modal-tag-edit' });
  }

  // Edit tag
  async editTag(newTag: string) {
    this.spinner.show();

    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    let duplicate: boolean = false;

    for await (const tag of this.tags) {
      if (tag.name === newTag) duplicate = true;
    }

    if (!duplicate) {
      let updateTag: Tag = {
        _id: new Types.ObjectId(this.editTagId),
        name: newTag,
        organization: this.loggedInUser.organization.toString(),
      };
      this.editSubscription = this.tagService
        .putTag(updateTag, this.editTagId)
        .subscribe(() => {
          this.spinner.hide();
        });
        
      this.modalService.dismissAll();

      this.ngOnInit();
    } else {
      this.toastrService.error(
        'De gegeven tag naam is al in gebruik!',
        'Tag niet gewijzigd!'
      );

      this.spinner.hide();
    }
  }

  // Delete modal
  deleteModal(content: any, tagId: string, tagName: string) {
    this.deleteTagId = tagId;
    this.deleteTagName = tagName;
    this.modalService.open(content, { ariaLabelledBy: 'modal-tag-delete' });
  }

  // Delete tag
  deleteTag() {
    this.deleteSubscription = this.tagService
      .deleteTag(this.deleteTagId, this.loggedInUser.organization.toString())
      .subscribe();

    this.modalService.dismissAll();

    this.ngOnInit();
  }

  // Destroy all subscriptions
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
    this.statusSubscription?.unsubscribe;
    this.logSubscription?.unsubscribe;
  }
}
