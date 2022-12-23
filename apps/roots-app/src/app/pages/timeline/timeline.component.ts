/* eslint-disable prefer-const */
import {
  AfterContentChecked,
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from '@roots/data';
import { map, Observable, startWith } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { EventService } from '../event/event.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { TagService } from '../tag/tag.service';
import { Event } from '../event/event.model';
import { Tag } from '../tag/tag.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'roots-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent
  implements OnInit, AfterViewChecked, AfterContentChecked
{
  events: any = [];
  standardEvents: any = [];
  throttle = 0;
  distance = 0;
  old_records = 0;
  new_records = 5;
  loggedInUser!: User;
  organizationId: string | undefined;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredTags: Observable<string[]> | undefined;
  tags: string[] = [];
  allTags: string[] = [];

  @ViewChild('tagInput') tagInput?: ElementRef<HTMLInputElement>;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private tagService: TagService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) =>
          this.eventService.getEventsPerPage(
            this.old_records,
            this.new_records,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            params.get('organizationId')!
          )
        )
      )
      .subscribe((events) => {
        this.events = events;
        this.standardEvents = events;

        events.forEach((event) => {
          event.eventDate = new Date(event.eventDate);
        });
      });

    this.authService
      .getUserFromLocalStorage()
      .subscribe((user) => (this.loggedInUser = user));

    this.organizationId = this.loggedInUser.organization.toString();
    this.getAllTags().then(() => {
      this.filteredTags = this.tagCtrl.valueChanges.pipe(
        startWith(null),
        map((tag: string | null) =>
          tag ? this._filter(tag) : this.allTags.slice()
        )
      );
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

  ngAfterContentChecked(): void {
    let currentYear = 0;
    this.events.forEach(
      (event: { eventDate: { getFullYear: () => number }; _id: string }) => {
        if (event.eventDate.getFullYear() === currentYear) {
          document
            .getElementById('timeline-year-' + event._id)
            ?.classList.add('d-none');
        } else {
          currentYear = event.eventDate.getFullYear();
        }
      }
    );
  }

  onScroll(): void {
    this.old_records = this.old_records + this.new_records;
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) =>
          this.eventService.getEventsPerPage(
            this.old_records,
            this.new_records,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            params.get('organizationId')!
          )
        )
      )
      .subscribe((newEvents) => {
        newEvents.forEach((event) => {
          event.eventDate = new Date(event.eventDate);
          this.events.push(event);
        });
      });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.tags.push(value);
    }

    event.chipInput.clear();

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.tags?.includes(event.option.viewValue)) {
      this.tags.push(event.option.viewValue);

      if (this.tagInput) {
        this.tagInput.nativeElement.value = '';
      }

      this.tagCtrl.setValue(null);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter((tag) =>
      tag.toLowerCase().includes(filterValue)
    );
  }

  async getAllTags() {
    if (this.organizationId) {
      const tags = await this.tagService
        .getAllTagsByOrganization(this.organizationId)
        .toPromise();
      if (tags) {
        for await (const tag of tags) {
          this.allTags?.push(tag.name);
        }
      }
    }
  }

  async searchOnTag() {
    let fullSelectedTags: Tag[] = [];
    let fullTags = await this.tagService
      .getAllTagsByOrganization(this.organizationId as string)
      .toPromise();

    for await (const tag of this.tags) {
      fullSelectedTags.push(fullTags?.filter((p) => p.name === tag).at(0));
    }

    const tempEvents = this.standardEvents as Event[];
    let newEvents: Event[] = [];

    if (this.tags.length === 1) {
      for await (const event of tempEvents) {
        for await (const tag of event.tags) {
          if (fullSelectedTags.filter((p) => p._id === tag).length > 0) {
            newEvents.push(event);
          }
        }
      }
    } else if (this.tags.length > 1) {
      let containsAllTags = true;

      for await (const event of tempEvents) {
        for await (const fullSelectedTag of fullSelectedTags) {
          if (
            event.tags.filter((p) => p === fullSelectedTag._id).length === 0
          ) {
            containsAllTags = false;
          }
        }

        if (containsAllTags) {
          newEvents.push(event);
        } else {
          containsAllTags = true;
        }
      }
    }

    if (newEvents.length === 0 && this.tags.length === 0) {
      this.events = this.standardEvents;
    } else if (newEvents.length === 0) {
      this.toastrService.error(
        'Geen gebeurtenissen beschikken over deze tag(s)!',
        'Filteren gefaald!'
      );
      this.events = this.standardEvents;
    } else {
      this.events = newEvents;
    }
  }
}
