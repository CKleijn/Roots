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
import { map, Observable, of, startWith } from 'rxjs';
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
import { MatDialog } from '@angular/material/dialog';
import { FilterComponent } from './filter/filter.component';
// import { FilterComponent } from './filter/filter.component';

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
  fullTags: any[] = [];
  fullSelectedTags: Tag[] = [];
  newEvents: Event[] = [];
  containsAllTags = true;
  radioValue: string | undefined;
  showArchivedEvents = false;
  searchType: string | undefined;
  searchterm = '';
  allEvents: Event[] = [];

  @ViewChild('tagInput') tagInput?: ElementRef<HTMLInputElement>;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private tagService: TagService,
    private dialog: MatDialog
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
          tag ? this._filter(tag).sort() : this.allTags.slice().sort()
        )
      );
    });
    this.radioValue = 'and';
    this.searchType = 'terms';
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

    if (this.allTags?.includes(value)) {
      if (this.tags?.length > 0) {
        if (!this.tags?.includes(value)) this.tags.push(value);
      } else {
        this.tags.push(value);
      }
    }

    event.chipInput.clear();

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) this.tags.splice(index, 1);
    this.filteredTags = this.filteredTags?.pipe(
      map((tags) => tags.concat(tag)),
      map((tags) => tags?.sort())
    );
  }

  reset(): void {
    this.tags = [];
    this.events = this.standardEvents;
    this.filteredTags = of(this.allTags);
    this.radioValue = 'and';
    this.searchType = 'terms';
    this.showArchivedEvents = false;
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.tags?.includes(event.option.viewValue)) {
      this.tags.push(event.option.viewValue);
      this.filteredTags = this.filteredTags?.pipe(
        map((tags) => tags.filter((tag) => tag !== event.option.viewValue))
      );

      if (this.tagInput) this.tagInput.nativeElement.value = '';

      this.tagCtrl.setValue(null);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    if (filterValue.length >= 3) {
      return this.allTags.filter((tag) =>
        tag.toLowerCase().includes(filterValue)
      );
    }

    return [];
  }

  async getAllTags() {
    // Get all tags from the organization if the organization exists
    if (this.organizationId) {
      const tags = await this.tagService
        .getAllTagsByOrganization(this.organizationId)
        .toPromise();
      if (tags) {
        // Push all tags into an array (single request)
        for await (const tag of tags) {
          // Only tag names for dropdown
          this.allTags?.push(tag.name);
          // Whole tag object for filter
          this.fullTags?.push(tag);
        }
      }
    }
  }

  async searchOnTag() {
    // Clear array from previous search
    this.fullSelectedTags = [];
    this.newEvents = [];
    // Push all tags which are selected in array
    for await (const tag of this.tags)
      this.fullSelectedTags.push(
        this.fullTags?.filter((p) => p.name === tag).at(0)
      );
    // If one tag is selected filter events only on one tag
    if (this.tags.length === 1) {
      for await (const event of this.standardEvents as Event[]) {
        for await (const tag of event.tags) {
          if (this.fullSelectedTags.filter((p) => p._id === tag).length > 0)
            this.newEvents.push(event);
        }
      }
    } else if (this.tags.length > 1) {
      // If more then one tag is selected filter events on all selected tags
      // Event must have all selected tags for it to go through the filter
      if (this.radioValue === 'and') {
        for await (const event of this.standardEvents as Event[]) {
          for await (const fullSelectedTag of this.fullSelectedTags) {
            if (
              event.tags.filter((p) => p === fullSelectedTag._id).length === 0
            )
              this.containsAllTags = false;
          }
          this.containsAllTags
            ? this.newEvents.push(event)
            : (this.containsAllTags = true);
        }
        // Event must have only one selected tag for it to go through the filter
      } else if (this.radioValue === 'or') {
        for await (const event of this.standardEvents as Event[]) {
          for await (const fullSelectedTag of this.fullSelectedTags) {
            if (
              event.tags.filter((p) => p === fullSelectedTag._id).length > 0
            ) {
              if (this.newEvents.filter((e) => e === event).length === 0)
                this.newEvents.push(event);
            }
          }
        }
      }
    }
    // If there are no selected tags and no events go through filter
    if (this.newEvents.length === 0 && this.tags.length === 0) {
      this.events = this.standardEvents;
      // If no events go through filter
    } else if (this.newEvents.length === 0) {
      this.events = [];
      // If there are events after filter, so if filter succeeds
    } else {
      this.events = this.newEvents;
    }
  }

  //searching on a term
  searchOnTerm() {
    //if there is an organizationId -> get events by term
    if (this.organizationId) {
      this.eventService
        .getEventsByTerm(this.searchterm, this.organizationId)
        .subscribe((events) => {
          //retrieve the filter events
          let filterEvents = events;
          //assign dates to the events
          filterEvents.forEach(
            (event: { eventDate: string | number | Date }) => {
              event.eventDate = new Date(event.eventDate);
            }
          );
          //assign filterevents to the eventlist
          this.events = filterEvents;
        });
    }
  }
  
  switchSearchType(type: string) {
    this.searchType = type;
  }

  openFilter() {
    const dialogref = this.dialog.open(FilterComponent, {
      data: {
        showArchivedEvents: this.showArchivedEvents,
        radioValue: this.radioValue,
      },
    });
    dialogref.afterClosed().subscribe((data) => {
      this.showArchivedEvents = data.showArchivedEvents;
      this.radioValue = data.radioValue;
    });
  }
}
