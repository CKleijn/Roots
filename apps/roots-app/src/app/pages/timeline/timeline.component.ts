import { Component, OnInit } from '@angular/core';
import { Event } from '../event/event.model';
import { EventService } from '../event/event.service';

@Component({
  selector: 'roots-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit {
  events: Event[] = [];

  constructor(private eventService: EventService) {}
  ngOnInit(): void {
    this.eventService.getAllEvents().subscribe((events) => {
      this.events = events;

      events.forEach(event => {
        event.eventDate = new Date(event.eventDate);
      });
    });

    this.events.push(
      {
        title: 'Title dededed',
        description: 'Descr Test',
        content: 'Content Test',
        eventDate: new Date('2018-01-10'),
      },
      {
        title: 'Title dededed',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident eaque natus iusto, corporis ipsa fugiat minus dolorum voluptatum perferendis assumenda voluptate perspiciatis illo corrupti blanditiis suscipit vel quasi delectus velit animi officiis error nobis, laboriosam earum! Ea vitae obcaecati temporibus dignissimos eveniet suscipit et architecto laboriosam reprehenderit veniam autem quod, doloremque asperiores pariatur beatae deserunt ad enim corporis repellendus, consectetur ratione magnam animi omnis. Aperiam culpa laborum accusamus soluta. Quas laborum asperiores pariatur magnam consequuntur et id tempora repellat provident magni tenetur dicta iusto ipsam doloremque, nulla blanditiis corporis rerum officiis eius inventore facilis esse veniam perspiciatis recusandae? Porro, facere quam dolor eveniet ad dolores incidunt labore quo eligendi totam. Tempora ut necessitatibus deserunt perferendis, quod doloremque vero veniam veritatis, in fugiat ducimus repellendus mollitia eius inventore facilis provident voluptatum distinctio velit deleniti omnis. Aperiam optio eaque similique? Recusandae itaque corrupti sunt aperiam aliquid odio ad natus, nulla id repellendus!',
        content: 'Content Test',
        eventDate: new Date('2018-01-11'),
      },
      {
        title: 'Title dededed',
        description: 'Descr Test',
        content: 'Content Test',
        eventDate: new Date('2018-01-11'),
      },
      {
        title: 'Title dededed',
        description: 'Descr Test',
        content: 'Content Test',
        eventDate: new Date('2018-01-21'),
      },
      {
        title: 'Title dededed',
        description: 'Descr Test',
        content: 'Content Test',
        eventDate: new Date('2018-02-30'),
      },
      {
        title: 'Title dededed',
        description: 'Descr Test',
        content: 'Content Test',
        eventDate: new Date('2018-04-01'),
      },
      {
        title: 'Title dededed',
        description: 'Descr Test',
        content: 'Content Test',
        eventDate: new Date('2018-10-01'),
      },
      {
        title: 'Title dededed',
        description: 'Descr Test',
        content: 'Content Test',
        eventDate: new Date('2018-10-11'),
      },
      {
        title: 'Title dededed',
        description: 'Descr Test',
        content: 'Content Test',
        eventDate: new Date('2018-11-11'),
      },
      {
        title: 'Title dededed',
        description: 'Descr Test',
        content: 'Content Test',
        eventDate: new Date('2018-12-04'),
      },
    );

    console.log(this.events.length);
  }
}
