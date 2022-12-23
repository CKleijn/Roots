/* eslint-disable prefer-const */
import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { User } from '@roots/data';
import { AuthService } from '../auth/auth.service';
import { EventService } from '../event/event.service';

@Component({
  selector: 'roots-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit, AfterViewChecked, AfterContentChecked {
  events: any = [];
  throttle = 20;
  distance = 2;
  old_records = 0;
  new_records = 5;
  loggedInUser!: User;
  constructor(
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.eventService
      .getEventsPerPage(this.old_records, this.new_records)
      .subscribe((events) => {
        this.events = events;

        events.forEach((event) => {
          event.eventDate = new Date(event.eventDate);
        });
      });

    this.authService
      .getUserFromLocalStorage()
      .subscribe((user) => (this.loggedInUser = user));
  }


  ngAfterContentChecked(): void {
    let currentYear = 0;
    this.events.forEach((event: { eventDate: { getFullYear: () => number; }; _id: string; }) => {
      if (event.eventDate.getFullYear() === currentYear) {
        document
          .getElementById('timeline-year-' + event._id)
          ?.classList.add('d-none');
      } else {
        currentYear = event.eventDate.getFullYear();
      }
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
  }

  onScroll(): void {
    this.eventService
      .getEventsPerPage(this.old_records, this.new_records)
      .subscribe((events) => {
        this.old_records += this.new_records;
        events.forEach((event) => {
          event.eventDate = new Date(event.eventDate);
        });
        events.forEach((event) => {
          if (this.events.indexOf(event) === 1) {
            this.events.push(event);
          }
        });
      });
  }
}
