/* eslint-disable prefer-const */
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ILog, Organization, User } from '@roots/data';
import { Types } from 'mongoose';
import { ToastrService } from 'ngx-toastr';
import { elementAt, Subscription, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Tag } from '../tag/tag.model';
import { TagService } from '../tag/tag.service';
import { OrganizationService } from './organization.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

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
  logSubscription!: Subscription;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<ILog>;
  logs:ILog[] = [];
  displayedColumnsLog: string[] = ['Gebruiker', 'Actie', 'Object', 'Wanneer'];

  constructor(
    private organizationService: OrganizationService,
    private authService: AuthService,
    private tagService: TagService,
    private modalService: NgbModal,
    private router: Router,
    private toastrService: ToastrService
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
    // Get tags
    this.tagsSubscription = this.tagService.getAllTagsByOrganization(this.loggedInUser.organization.toString())
      .subscribe((tags) => this.tags = tags?.sort((a, b) => a.name.localeCompare(b.name)));
    // Get organization name
    this.organizationSubscription = this.organizationService.getById(this.loggedInUser.organization.toString())
      .subscribe((organization) => this.organization = organization);

      // get log items
      this.logSubscription = this.organizationService.log(this.loggedInUser.organization.toString())
      .subscribe((log) => { 
        this.logs = log.logs;
        this.dataSource.data = log.logs; 

        // couple paginator and sort to datasource 
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort
      })
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
      this.organizationService.logCreate(this.loggedInUser, 'Gewijzigd', '(T) ' + updateTag.name).subscribe();

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
