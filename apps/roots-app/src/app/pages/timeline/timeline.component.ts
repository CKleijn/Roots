/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  AfterContentChecked,
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { User } from '@roots/data';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, of, startWith, Subscription, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Event } from '../event/event.model';
import { EventService } from '../event/event.service';
import { Tag } from '../tag/tag.model';
import { TagService } from '../tag/tag.service';
import { FilterComponent } from './filter/filter.component';

@Component({
  selector: 'roots-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent
  implements OnInit, AfterViewChecked, AfterContentChecked, OnDestroy
{
  routeSubscription!: Subscription;
  authSubscription!: Subscription;
  scrollSubscription!: Subscription;
  allEventsSubscription!: Subscription;
  eventSubscription!: Subscription;
  dialogSubscription!: Subscription;
  termSubscription!: Subscription;
  events: any[] = [];
  standardEvents: any = [];
  allEvents: Event[] = [];
  throttle = 0;
  distance = 0;
  old_records = 0;
  new_records = 5;
  currentYear = 0;
  loggedInUser!: User;
  organizationId: string | undefined;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredTags: Observable<string[]> | undefined;
  termCtrl = new FormControl('');
  tags: string[] = [];
  allTags: string[] = [];
  fullTags: any[] = [];
  fullSelectedTags: Tag[] = [];
  newEvents: Event[] = [];
  containsAllTags = true;
  radioValue: string | undefined | null;
  showArchivedEvents: boolean =
    JSON.parse(localStorage.getItem('showArchivedEvents')!) || false;
  searchType: string | undefined | null;
  searchterm = '';
  searchRequest = false;
  filtered = false;
  eventTitleOptions: string[] = [];

  @ViewChild('tagInput') tagInput?: ElementRef<HTMLInputElement>;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private tagService: TagService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  // Load everything when start up component
  ngOnInit(): void {
    // Get first 5 events and store all events
    this.routeSubscription = this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) =>
          this.eventService.getEventsPerPage(
            this.old_records,
            this.new_records,
            params.get('organizationId')!,
            this.showArchivedEvents
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
    // Get all events
    this.getAllEvents();
    // If there is a searchterm - call searchOnTermFilter
    this.termSubscription = this.termCtrl.valueChanges.subscribe(() => {
      if (this.searchterm) {
        this.searchterm.length > 1
          ? this.searchOnTermFilter()
          : (this.eventTitleOptions = []);
      } else {
        this.eventTitleOptions = [];
      }
    });
    // Get current user
    this.authSubscription = this.authService
      .getUserFromLocalStorage()
      .subscribe((user) => (this.loggedInUser = user));
    // Get current organization
    this.organizationId = this.loggedInUser.organization.toString();
    // Get all tags
    this.getAllTags();
    // Get filtered tags and sort them
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this._filter(tag).sort() : this.allTags.slice().sort()
      )
    );
    // Add default filter values

    console.log(this.searchType);
    console.log(localStorage.getItem('searchType'))

    this.searchType = localStorage.getItem('searchType') || 'terms';
    localStorage.setItem('searchType', this.searchType);

    this.radioValue = localStorage.getItem('radioValue') || 'and';
    localStorage.setItem('radioValue', this.radioValue);

    console.log(localStorage.getItem('showArchivedEvents'));
    localStorage.setItem(
      'showArchivedEvents',
      JSON.stringify(this.showArchivedEvents)
    );
  }

  // Observer to check if an entry has been seen by the user + some CSS classes
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

  // Foreach event create a new Date so we can use the currentYear function + some CSS classes
  ngAfterContentChecked(): void {
    this.events.forEach((event: { eventDate: Date; _id: string }) => {
      const date = new Date(event.eventDate);
      if (date.getFullYear() === this.currentYear) {
        document
          .getElementById('timeline-year-' + event._id)
          ?.classList.add('d-none');
      } else {
        this.currentYear = date.getFullYear();
      }
    });
  }

  // Get next 5 events when scrolling down
  onScroll(): void {
    this.old_records += this.new_records;
    this.scrollSubscription = this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) =>
          this.eventService.getEventsPerPage(
            this.old_records,
            this.new_records,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            params.get('organizationId')!,
            this.showArchivedEvents
          )
        )
      )
      .subscribe((newEvents) => {
        // If filter isn't used show every event
        if (!this.filtered) {
          newEvents.forEach((event) => {
            event.eventDate = new Date(event.eventDate);
            this.events.push(event);
          });
          // If filter is used show only the events with the conditions
        } else {
          newEvents.forEach((event) => {
            if (this.events.includes(event)) {
              event.eventDate = new Date(event.eventDate);
              this.events.push(event);
            }
          });
        }
      });
  }

  // Get all events and store them
  getAllEvents(): Event[] {
    this.allEvents = [];
    this.allEventsSubscription = this.eventService
      .getAllEvents()
      .subscribe((events) => {
        events.forEach((event) => {
          if (
            this.showArchivedEvents ||
            (!this.showArchivedEvents && event.isActive)
          ) {
            event.eventDate = new Date(event.eventDate);
            this.allEvents.push(event);
          }
        });
        return events;
      });
    return this.allEvents;
  }

  // Switch filter (tags/terms)
  switchSearchType(type: string) {
    this.searchType = type;
  }

  // Open dialog with all filters
  openFilter() {
    const dialogref = this.dialog.open(FilterComponent, {
      data: {
        showArchivedEvents: this.showArchivedEvents,
        radioValue: this.radioValue,
        searchType: this.searchType,
      },
    });
    this.dialogSubscription = dialogref.afterClosed().subscribe((data) => {
      if (data) {
        if (typeof data.showArchivedEvents === 'boolean') {
          this.showArchivedEvents = data.showArchivedEvents;
          localStorage.setItem(
            'showArchivedEvents',
            JSON.stringify(data.showArchivedEvents)
          );
        }

        if(data.radioValue){
          localStorage.setItem('radioValue', data.radioValue)
          this.radioValue = data.radioValue;
        }

        this.events = this.getAllEvents();
      }
    });
  }

  // Get all tags from the organization if the organization exists
  async getAllTags() {
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

  // Add a tag to filter
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

  // Remove a tag from the filter
  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) this.tags.splice(index, 1);
    this.filteredTags = this.filteredTags?.pipe(
      map((tags) => tags.concat(tag)),
      map((tags) => tags?.sort())
    );
  }

  // Reset all filters
  reset(): void {
    this.tags = [];
    this.events = this.standardEvents;
    this.filteredTags = of(this.allTags);
    this.radioValue = 'and';
    this.searchType = 'terms';
    this.searchterm = '';
    this.showArchivedEvents = false;
    localStorage.setItem('radioValue', this.radioValue);
    localStorage.setItem('searchType', this.searchType);
    localStorage.setItem('showArchivedEvents', JSON.stringify(false));
    this.toastr.success(`Alle filters zijn gereset!`, 'Filters gereset!');
  }

  // Select a tag from the autocomplete
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

  // Trigger the autocomplete dropdown when entering 3 characters
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    if (filterValue.length >= 3) {
      return this.allTags.filter((tag) =>
        tag.toLowerCase().includes(filterValue)
      );
    }

    return [];
  }

  // Search events with tags
  async searchOnTag() {
    localStorage.setItem('searchType', 'tags');
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
      for await (const event of this.allEvents as Event[]) {
        for await (const tag of event.tags) {
          if (this.fullSelectedTags.filter((p) => p._id === tag).length > 0)
            this.newEvents.push(event);
        }
      }
    } else if (this.tags.length > 1) {
      // If more then one tag is selected filter events on all selected tags
      // Event must have all selected tags for it to go through the filter
      if (this.radioValue === 'and') {
        for await (const event of this.allEvents as Event[]) {
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
        for await (const event of this.allEvents as Event[]) {
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
      this.events = this.allEvents;
      // If no events go through filter
    } else if (this.newEvents.length === 0) {
      this.events = [];
      // Tell onScroll that filter is used
      this.filtered = true;
      // If there are events after filter, so if filter succeeds
    } else {
      this.events = this.newEvents;
      // Tell onScroll that filter is used
      this.filtered = true;
    }
    // Tell HTML this is a searchrequest
    this.searchRequest = true;
    // Show alert with total count of the results found
    const totalResults = this.events.length;
    totalResults === 1
      ? this.toastr.success(
          `Er is ${this.events.length} resultaat gevonden!`,
          'Tijdlijn gefiltert!'
        )
      : this.toastr.success(
          `Er zijn ${this.events.length} resultaten gevonden!`,
          'Tijdlijn gefiltert!'
        );
  }

  // Search on term filter
  searchOnTermFilter() {
    this.eventTitleOptions = [];
    this.allEvents.forEach((event: { title: string; isActive: boolean }) => {
      ((!this.showArchivedEvents && event.isActive) ||
        this.showArchivedEvents) &&
        event.title.includes(this.searchterm) &&
        this.eventTitleOptions.push(event.title);
    });
  }

  //searching on a term
  searchOnTerm() {
    localStorage.setItem('searchType', 'terms');
    //if there is an organizationId -> get events by term
    if (this.organizationId) {
      this.eventSubscription = this.eventService
        .getEventsByTerm(
          this.searchterm,
          this.organizationId,
          this.showArchivedEvents
        )
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
          // Tell onScroll that filter is used
          this.filtered = true;
          // Tell HTML this is a searchrequest
          this.searchRequest = true;
          // Show alert with total count of the results found
          const totalResults = this.events.length;
          totalResults === 1
            ? this.toastr.success(
                `Er is ${this.events.length} resultaat gevonden!`,
                'Tijdlijn gefiltert!'
              )
            : this.toastr.success(
                `Er zijn ${this.events.length} resultaten gevonden!`,
                'Tijdlijn gefiltert!'
              );
        });
    }
  }

  // Destroy all subscriptions
  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe;
    this.authSubscription?.unsubscribe;
    this.scrollSubscription?.unsubscribe;
    this.allEventsSubscription?.unsubscribe;
    this.eventSubscription?.unsubscribe;
    this.dialogSubscription?.unsubscribe;
    this.termSubscription?.unsubscribe;
  }
}
