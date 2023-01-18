/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { EventService } from '../event.service';
import { Event } from '../event.model';
import { TagService } from '../../tag/tag.service';
import { Tag } from '../../tag/tag.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'roots-event-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class EventDetailComponent implements OnInit, OnDestroy {
  routeSubscription!: Subscription;
  archiveSubscription!: Subscription;
  event!: Event;
  tags!: Tag[];
  day!: string;
  month!: string;
  year!: string;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private tagService: TagService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) {}

  // Load everything when start up component
  ngOnInit(): void {
    this.spinner.show();

    this.routeSubscription = this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) =>
          this.eventService.getEventById(params.get('eventId')!)
        )
      )
      .subscribe((foundEvent) => {
        if (foundEvent) {
          this.event = foundEvent;
          this.event.eventDate = new Date(this.event.eventDate);
          this.day = this.event.eventDate.toLocaleString('nl-NL', {
            day: 'numeric',
          });
          this.month = this.event.eventDate.toLocaleString('nl-NL', {
            month: 'short',
          });
          this.year = this.event.eventDate.toLocaleString('nl-NL', {
            year: 'numeric',
          });
          this.tags = new Array<Tag>();
          foundEvent.tags.forEach((tag) => {
            this.tagService.getTagById(tag).subscribe((foundTag) => {
              this.tags.push(foundTag);
            });
          });
        }

        this.spinner.hide();
      });
  }

  archiveModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-tag-edit' });
  }

  // Archive event
  async archiveEvent() {
    this.spinner.show();

    let updateBool: boolean;

    this.event.isActive ? (updateBool = false) : (updateBool = true);

    this.archiveSubscription = this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) =>
          this.eventService.archiveEvent(
            updateBool,
            params.get('eventId')!,
            params.get('organizationId')!
          )
        )
      )
      .subscribe((foundEvent) => {
        this.event = foundEvent;

        this.spinner.hide();
      });

    this.modalService.dismissAll();
    this.ngOnInit();
  }

  // Destroy all subscriptions
  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe;
    this.archiveSubscription?.unsubscribe;
  }
}
