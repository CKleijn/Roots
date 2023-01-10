/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { EventService } from '../event.service';
import { Event } from '../event.model';
import { TagService } from '../../tag/tag.service';
import { Tag } from '../../tag/tag.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Types } from 'mongoose';

@Component({
  selector: 'roots-event-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class EventDetailComponent implements OnInit {
  event!: Event;
  tags!: Tag[];

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private tagService: TagService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) =>
          this.eventService.getEventById(params.get('eventId')!)
        )
      )
      .subscribe((foundEvent) => {
        this.event = foundEvent;
        this.tags = new Array<Tag>
        foundEvent.tags.forEach((tag) => {
          this.tagService.getTagById(tag).subscribe((foundTag) => {
            this.tags.push(foundTag)
          });
        });
      });
  }

  archiveModal(content: any, ) {
    
    this.modalService.open(content, { ariaLabelledBy: 'modal-tag-edit' })
  }

  async archiveEvent() {
    let updateBool: boolean;
    if (this.event.isActive) {
       updateBool = false;
    } else {
       updateBool = true;
    } 

    this.route.paramMap
    .pipe(
      switchMap((params: ParamMap) =>
        this.eventService.archiveEvent(updateBool,params.get('eventId')!,params.get('organizationId')!)
      )
    )
    .subscribe((foundEvent) => {
      this.event = foundEvent;
    });

    this.modalService.dismissAll();
    this.ngOnInit()
  }
}
