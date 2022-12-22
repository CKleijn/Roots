/* eslint-disable prefer-const */
import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { User } from '@roots/data';
import { switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { EventService } from '../event/event.service';

@Component({
  selector: 'roots-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit, AfterViewChecked {
  events: any = [];
  throttle = 0;
  distance = 2;
  old_records = 0;
  new_records = 5;
  loggedInUser!: User;
  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) =>
          this.eventService.getEventsPerPage(
            this.old_records,
            this.new_records,
            params.get('organizationId')!
          )
        )
      )
      .subscribe((events) => {
        console.log('Read the first 5 events');
        this.events = events;

        events.forEach((event) => {
          event.eventDate = new Date(event.eventDate);
        });
      });

    this.authService
      .getUserFromLocalStorage()
      .subscribe((user) => (this.loggedInUser = user));
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

  onScroll(): void {
    console.log('scrolled');
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) =>
          this.eventService.getEventsPerPage(
            this.old_records,
            this.new_records,
            params.get('organizationId')!
          )
        )
      )
      .subscribe((events) => {
        console.log('Read another 5 events');
        this.old_records += this.new_records;
        events.forEach((event) => {
          event.eventDate = new Date(event.eventDate);
        });
        this.events.push(...events);
      });
  }
}
