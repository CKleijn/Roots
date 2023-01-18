/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-var-requires */
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as QuillNamespace from 'quill';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Event } from '../event.model';
import { EventService } from '../event.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipEditedEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { User } from '@roots/data';
import { TagService } from '../../tag/tag.service';
import { VideoHandler, Options } from 'ngx-quill-upload';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrganizationService } from '../../organization/organization.service';

let Quill: any = QuillNamespace;
const ImageResize = require('quill-image-resize-module');
const Emoji = require('quill-emoji');
Quill.register('modules/imageResize', ImageResize.default);
Quill.register('modules/emoji', Emoji.default);
Quill.register('modules/videoHandler', VideoHandler);

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
  loggedInUser$!: Observable<User | undefined>;
  eventId: string | undefined;
  event: Event = new Event();
  eventForm: FormGroup = new FormGroup({});
  prevEvent: string | undefined = '';
  organizationId: string | undefined;
  organizationIdString: string | undefined;
  error: string | undefined;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = [];
  allTags: string[] = [];
  tagCtrl = new FormControl('');
  filteredTags: Observable<string[] | undefined> | undefined;
  selectable = true;
  removable = true;
  editMode = false;
  needContext = false;
  editorStyle = {
    height: '100%',
    width: '100%',
  };
  // Setup quill editor
  config = {
    // Toolbar functions
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ align: [] }],
      ['emoji'],
      ['link', 'image', 'video'],
    ],
    // Image resize package
    imageResize: {
      modules: ['Resize', 'DisplaySize'],
    },
    // Custom video handler
    videoHandler: {
      upload: (file: any) => {
        return new Promise((resolve, reject) => {
          // Check if it's a correct file type
          if (file.type === 'video/mpeg' || file.type === 'video/mp4') {
            // Check if file size is under 15MB
            if (file.size < 15000000) {
              this.eventForm.controls['content'].setErrors({
                needContext: true,
              });
              this.needContext = true;
              resolve(file);
            } else {
              scroll(0, 0);
              this.toastrService.error(
                `Deze video overschreid de maximale uploadgrootte van 15 MB!`,
                'Video uploaden mislukt!'
              );
              reject(
                `Deze video overschreid de maximale uploadgrootte van 15 MB!`
              );
            }
          } else {
            scroll(0, 0);
            this.toastrService.error(
              `Deze video type wordt niet ondersteund!`,
              'Video uploaden mislukt!'
            );
            reject('Deze video type wordt niet ondersteund!');
          }
        });
      },
      accepts: ['mpeg', 'mp4'],
    } as Options,
    // Emoji package
    'emoji-toolbar': true,
  };

  @ViewChild('tagInput') tagInput?: ElementRef<HTMLInputElement>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService,
    private dateAdapter: DateAdapter<Date>,
    private tagService: TagService,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    private organizationService: OrganizationService
  ) {
    this.dateAdapter.setLocale('nl-NL');
  }

  // Load everything when start up component
  ngOnInit(): void {
    // Get event from eventId
    this.paramSubscription = this.route.paramMap.subscribe(
      (params: ParamMap) => ((this.eventId as any) = params.get('eventId'))
    );
    // Get current user + organization
    this.loggedInUser$ = this.authService.currentUser$;
    this.loggedInUserSubscription = this.loggedInUser$.subscribe((p) => {
      this.organizationIdString = p?.organization.toString();
    });
    // Setup event form with validators
    this.eventForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      content: new FormControl(null, [Validators.required]),
      tags: new FormControl(null),
      eventDate: new FormControl(null, [Validators.required]),
    });
    // Check if it's editMode
    if (this.eventId) this.editMode = true;
    // Get all tags and filter them
    this.getAllTags().then(() => {
      this.filteredTags = this.tagCtrl.valueChanges.pipe(
        startWith(null),
        map((tag: string | null) => {
          return tag ? this._filter(tag)?.sort() : this.allTags?.slice().sort();
        })
      );
    });
    // If it's editMode then change values
    if (this.editMode) {
      this.spinner.show();
      // Get correct event
      this.eventSubscription = this.eventService
        .getEventById(this.eventId as string)
        .subscribe({
          next: async (event) => {
            this.event = {
              ...event,
            };
            // Get tags from event
            await this.getCurrentTags();
            // Setup autocomplete dropdown
            for await (const tag of this.allTags) {
              if (this.tags.includes(tag)) {
                this.filteredTags = this.filteredTags?.pipe(
                  map((tags) => tags?.filter((t) => t !== tag))
                );
              }
            }
            // Edit event
            this.eventForm.patchValue({
              title: this.event.title,
              description: this.event.description,
              content: this.event.content,
              eventDate: new Date(this.event.eventDate)
                .toISOString()
                .slice(0, 10),
            });

            this.spinner.hide();
          },
          error: () =>
            this.router.navigate([
              `organizations/${this.organizationId}/timeline`,
            ]).then(() => {
              this.spinner.hide();
            }),
        });
    }
  }

  // Get all tags from organization
  async getAllTags() {
    if (this.organizationIdString) {
      const tags = await this.tagService
        .getAllTagsByOrganization(this.organizationIdString)
        .toPromise();
      if (tags) {
        for await (const tag of tags) {
          this.allTags?.push(tag.name);
        }
      }
    }
  }

  // Get current tags
  async getCurrentTags() {
    // eslint-disable-next-line prefer-const
    const tags = await this.tagService
      .getAllTagsByOrganization(this.organizationIdString as string)
      .toPromise();

    for await (const tagId of this.event.tags) {
      this.tags.push(tags?.filter((p) => p._id === tagId).at(0).name);
    }
  }

  // Check if tags exists
  async checkTagsExists() {
    for await (const tag of this.tags) {
      if (!this.allTags.includes(tag)) {
        if (this.organizationIdString) {
          await this.tagService
            .postTagInOrganization({ name: tag }, this.organizationIdString)
            .toPromise();
        }
      }
    }
  }

  // Add a tag
  add(tag: MatChipInputEvent): void {
    const value = (tag.value || '').trim();

    if (this.tags?.length > 0) {
      if (!this.tags?.includes(value)) this.tags.push(value);
    } else {
      this.tags.push(value);
    }

    tag.chipInput.clear();

    this.tagCtrl.setValue(null);
  }

  // Remove a tag from the tags
  remove(tag: string): void {
    const index = this.tags?.indexOf(tag);

    if (index > -1) {
      this.tags?.splice(index, 1);
      if (this.allTags?.includes(tag)) {
        this.filteredTags = this.filteredTags?.pipe(
          map((tags) => tags?.concat(tag)),
          map((tags) => tags?.sort())
        );
      }
    }
  }

  // Select a tag from the autocomplete dropdown
  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.tags?.includes(event.option.viewValue)) {
      this.tags?.push(event.option.viewValue);
      this.filteredTags = this.filteredTags?.pipe(
        map((tags) => tags?.filter((tag) => tag !== event.option.viewValue))
      );

      if (this.tagInput) this.tagInput.nativeElement.value = '';

      this.tagCtrl.setValue(null);
    }
  }

  // Trigger the autocomplete dropdown
  private _filter(value: string): string[] | undefined {
    const filterValue = value.toLowerCase();

    return this.allTags?.filter((tag) =>
      tag.toLowerCase().includes(filterValue)
    );
  }

  // On change listener for content video
  onChange(event: any) {
    if (this.needContext) {
      event !== this.prevEvent
        ? (this.needContext = false)
        : (this.prevEvent = event);
    }
  }

  // Submit form
  async onSubmit() {
    this.spinner.show();

    let allTags = [] as any[] | undefined;
    // eslint-disable-next-line prefer-const
    let allSelectedTags = [] as any[];
    // Get all tags that already exists
    await this.checkTagsExists();
    // Get all tags from organization
    if (this.organizationIdString) {
      allTags = await this.tagService
        .getAllTagsByOrganization(this.organizationIdString)
        .toPromise();
      for await (const tagName of this.tags) {
        allSelectedTags.push(
          allTags?.filter((p) => p.name === tagName).at(0)?._id
        );
      }
    }
    // Refactor date
    const date = new Date(this.eventForm.value.eventDate);
    date.setHours(date.getHours() + 2);
    this.eventForm.value.eventDate = date;
    // Get current user
    this.authSubscription = this.authService.getUserFromLocalStorage().subscribe({
      next: (user: any) => (this.organizationId = user.organization),
      error: (error) => (this.error = error.message),
    });
    // Check if video has been uploaded
    if (!this.needContext) {
      // Create
      if (!this.editMode) {
        this.createSubscription = this.eventService
          .postEvent(
            { ...this.eventForm.value, tags: allSelectedTags },
            this.organizationIdString as string
          )
          .subscribe({
            error: (error) => (this.error = error.message),
            complete: () => (this.spinner.hide())
          });
        // Edit
      } else {
        this.updateSubscription = this.eventService
          .putEvent(
            { ...this.eventForm.value, tags: allSelectedTags },
            this.eventId as string,
            this.organizationIdString as string
          )
          .subscribe({
            error: (error) => (this.error = error.message),
            complete: () => (this.spinner.hide())
          });
      }
    } else {
      scroll(0, 0);
      this.toastrService.error(
        `Deze gebeurtenis voldoet nog niet aan alle validatie!`,
        'Validatie mislukt!'
      );

      this.spinner.hide();
    }
  }

  // Delete all subscriptions
  ngOnDestroy(): void {
    this.paramSubscription?.unsubscribe;
    this.eventSubscription?.unsubscribe;
    this.authSubscription?.unsubscribe;
    this.createSubscription?.unsubscribe;
    this.updateSubscription?.unsubscribe;
    this.getAllTagsSubscription?.unsubscribe;
    this.loggedInUserSubscription?.unsubscribe;
  }
}
