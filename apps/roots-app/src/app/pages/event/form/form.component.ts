import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Event } from '../event.model';
import { EventService } from '../event.service';
import { Tag } from '../../tag/tag.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipEditedEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { User } from '@roots/data';
import { TagService } from '../../tag/tag.service';

@Component({
  selector: 'roots-event-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class EventFormComponent implements OnInit, OnDestroy {
  paramSubscription: Subscription | undefined;
  eventSubscription: Subscription | undefined;
  authSubscription: Subscription | undefined;
  createSubscription: Subscription | undefined;
  updateSubscription: Subscription | undefined;
  getAllTagsSubscription: Subscription | undefined;
  loggedInUserSubscription: Subscription | undefined;

  loggedInUser$!: Observable<User | undefined>
  eventId: string | undefined;
  organizationId: string | undefined;
  organizationIdString: string | undefined;
  editMode = false;
  error: string | undefined;
  event: Event = new Event();
  eventForm: FormGroup = new FormGroup({});
  editorStyle = {
    height: '300px',
    width: '100%'
  }
  config = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
    ]
  }

  //tags
  separatorKeysCodes: number[] = [ENTER, COMMA]
  tagCtrl = new FormControl('');
  filteredTags: Observable<string[] | undefined>;
  tags: string[] = [];
  allTags: string[] = [];
  selectable = true;
  removable = true;

  @ViewChild('tagInput') tagInput?: ElementRef<HTMLInputElement>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService,
    private dateAdapter: DateAdapter<Date>,
    private tagService: TagService,
  ) {
    this.dateAdapter.setLocale('nl-NL');
    this.filteredTags = this.tagCtrl.valueChanges.pipe(startWith(null), map((tag: string | null) => (tag ? this._filter(tag) : this.allTags?.slice())))
  }

  ngOnInit(): void {
    this.paramSubscription = this.route.paramMap.subscribe((params: ParamMap) => (this.eventId as any) = params.get('eventId'));

    this.loggedInUser$ = this.authService.currentUser$;
    this.loggedInUserSubscription = this.loggedInUser$.subscribe((p) => {
      this.organizationIdString = p?.organization.toString();
    });

    this.getAllTags();

    this.eventForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      content: new FormControl(null, [Validators.required]),
      tags: new FormControl(null),
      eventDate: new FormControl(null, [Validators.required])
    });

    if (this.eventId)
      this.editMode = true;

    if (this.editMode) {
      this.eventSubscription = this.eventService.getEventById(this.eventId as string).subscribe({
        next: (event) => {
          this.event = {
            ...event
          }

          this.getCurrentTags();

          this.eventForm.patchValue({
            title: this.event.title,
            description: this.event.description,
            content: this.event.content,
            eventDate: new Date(this.event.eventDate).toISOString().slice(0, 10)
          });
        },
        error: () => this.router.navigate(['timeline']),
      })
    }
  }

  async onSubmit() {
    let allTags = [] as any[] | undefined;
    // eslint-disable-next-line prefer-const
    let allSelectedTags = [] as any[];

    await this.checkTagsExists();

    if (this.organizationIdString) {
      allTags = await this.tagService.getAllTagsByOrganization(this.organizationIdString).toPromise();
      for await (const tagName of this.tags) {
        allSelectedTags.push(allTags?.filter(p => p.name === tagName).at(0)?._id);
      }
    }

    const date = new Date(this.eventForm.value.eventDate);
    date.setHours(date.getHours() + 2);
    this.eventForm.value.eventDate = date;

    this.authSubscription = this.authService.currentUser$.subscribe({
      next: (user: any) => this.organizationId = user.company,
      error: (error) => this.error = error.message
    });

    if (!this.editMode) {
      this.createSubscription = this.eventService.postEvent({ ...this.eventForm.value, tags: allSelectedTags }, (this.organizationIdString as string)).subscribe({
        next: () => this.router.navigate(['timeline']),
        error: (error) => this.error = error.message
      })
    }
    else {
      this.updateSubscription = this.eventService.putEvent({ ...this.eventForm.value, tags: allSelectedTags }, (this.eventId as string), (this.organizationIdString as string)).subscribe({
        next: () => this.router.navigate(['timeline']),
        error: (error) => this.error = error.message
      })
    }
  }

  ngOnDestroy(): void {
    this.paramSubscription?.unsubscribe;
    this.eventSubscription?.unsubscribe;
    this.authSubscription?.unsubscribe;
    this.createSubscription?.unsubscribe;
    this.updateSubscription?.unsubscribe;
    this.getAllTagsSubscription?.unsubscribe;
    this.loggedInUserSubscription?.unsubscribe;
  }

  add(tag: MatChipInputEvent): void {
    const value = (tag.value || '').trim();

    if (value) {
      this.tags?.push(value);
    }

    tag.chipInput.clear();

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags?.indexOf(tag);

    if (index > -1) {
      this.tags?.splice(index, 1);
    }
  }

  selected(tag: MatAutocompleteSelectedEvent): void {
    if (!this.tags?.includes(tag.option.viewValue)) {
      this.tags?.push(tag.option.viewValue);

      if (this.tagInput) {
        this.tagInput.nativeElement.value = '';
      }

      this.tagCtrl.setValue(null);
    }
  }

  private _filter(value: string): string[] | undefined {
    const filterValue = value.toLowerCase();

    return this.allTags?.filter(tag => tag.toLowerCase().includes(filterValue));
  }

  async getAllTags() {
    if (this.organizationIdString) {
      const tags = await this.tagService.getAllTagsByOrganization(this.organizationIdString).toPromise();
      if (tags) {
        for await (const tag of tags) {
          this.allTags?.push(tag.name);
        }
      }
    }
  }

  async checkTagsExists() {
    for await (const tag of this.tags) {
      if (!this.allTags.includes(tag)) {
        if (this.organizationIdString) {
          await this.tagService.postTagInOrganization({ name: tag }, this.organizationIdString).toPromise();
        }
      }
    }
  }

  async getCurrentTags() {
    // eslint-disable-next-line prefer-const
    const tags = await this.tagService.getAllTagsByOrganization(this.organizationIdString as string).toPromise();

    for await (const tagId of this.event.tags) {
      this.tags.push(tags?.filter(p => p._id === tagId).at(0).name);
    }
  }

  validateTags(control: FormControl): { [s: string]: boolean } {
    const tags = control.value;

    console.log(tags);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { tags: false };
  }
}
