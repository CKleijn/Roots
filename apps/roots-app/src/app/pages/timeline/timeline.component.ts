import { Component, OnInit } from '@angular/core';
import { EventService } from '../event/event.service';

@Component({
  selector: 'roots-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit {
  events: any = [];

  constructor(private eventService: EventService) {}
  ngOnInit(): void {
    this.eventService.getAllEvents().subscribe((events) => {
      this.events = events;

      events.forEach((event) => {
        event.eventDate = new Date(event.eventDate);
      });
    });
  }
}
