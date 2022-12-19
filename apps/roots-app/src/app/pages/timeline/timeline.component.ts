/* eslint-disable prefer-const */
import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { elementAt } from 'rxjs';
import { EventService } from '../event/event.service';

@Component({
  selector: 'roots-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit, AfterViewChecked {
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

  ngAfterViewChecked(): void {
    let observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.remove('timeline-container');
        if (entry.isIntersecting) {
          entry.target.classList.add('timeline-container-seen');
        }
      });
    });

    let targetGetIn = document.querySelectorAll('.timeline-container');
    targetGetIn.forEach((element) => {
      observer.observe(element);
    });
    return;
  }
}
