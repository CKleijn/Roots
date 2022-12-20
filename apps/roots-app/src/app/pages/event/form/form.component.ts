import * as QuillNamespace from 'quill';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Event } from '../event.model';
import { EventService } from '../event.service';

let Quill: any = QuillNamespace;
const ImageResize = require('quill-image-resize-module');
const Emoji = require('quill-emoji');
Quill.register('modules/imageResize', ImageResize.default);
Quill.register("modules/emoji", Emoji.default);

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
  eventId: string | undefined;
  organizationId: string | undefined;
  editMode = false;
  error: string | undefined;
  event: Event = new Event();
  eventForm: FormGroup = new FormGroup({});
  editorStyle = {
    height: '100%',
    width: '100%'
  }
  config = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }], 
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['emoji'],
    ],
    imageResize: {
      modules: ['Resize', 'DisplaySize']
    },
    'emoji-toolbar': true,
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('nl-NL')
  }

  ngOnInit(): void {
    this.paramSubscription = this.route.paramMap.subscribe((params: ParamMap) => (this.eventId as any) = params.get('eventId'));

    this.eventForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      content: new FormControl(null, [Validators.required]),
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

  onSubmit() {
    const date = new Date(this.eventForm.value.eventDate);
    date.setHours(date.getHours() + 2);
    this.eventForm.value.eventDate = date;

    this.authSubscription = this.authService.currentUser$.subscribe({
      next: (user: any) => this.organizationId = user.organization,
      error: (error) => this.error = error.message
    });

    if (!this.editMode) {
      this.createSubscription = this.eventService.postEvent(this.eventForm.value, (this.organizationId as string)).subscribe({
        next: () => this.router.navigate(['timeline']),
        error: (error) => this.error = error.message
      })
    }
    else {
      this.updateSubscription = this.eventService.putEvent(this.eventForm.value, (this.eventId as string), (this.organizationId as string)).subscribe({
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
  }
}
