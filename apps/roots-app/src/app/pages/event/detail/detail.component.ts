import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs';
import { EventService } from '../event.service';
import { Event } from '../event.model'


@Component({
  selector: 'roots-event-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class EventDetailComponent implements OnInit {
  event!: Event;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) =>
          this.eventService.getEventById(params.get('eventId')!)
        )
      )
      .subscribe((foundEvent) => (this.event = foundEvent));
  }
}
