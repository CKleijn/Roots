import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { of, Subscription, switchMap } from 'rxjs';
import { EventService } from '../event.service';
import { Event } from '../event.model'
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'roots-event-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class EventFormComponent implements OnInit, OnDestroy {
  paramSubscription: Subscription | undefined;
  eventSubscription: Subscription | undefined;
  eventId: string | null = null;
  editMode: boolean = false;
  error: string | null = null;
  event: Event = new Event();
  eventForm: FormGroup = new FormGroup({});
  editorStyle = {
    height: '300px',
    width: '100%'
  }
  config = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
    ]
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.paramSubscription = this.route.paramMap.subscribe((params: ParamMap) => this.eventId = params.get('eventId'));

    this.eventForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      content: new FormControl(null, [Validators.required]),
      eventDate: new FormControl(null, [Validators.required])
    });

    if (this.eventId)
      this.editMode = true;

    if (this.editMode) {
      this.eventSubscription = this.eventService.getEventById(this.eventId!).subscribe({
        next: (event) => {
          this.event = {
            ...event
          }
  
          this.eventForm.patchValue({
            title: this.event.title,
            description: this.event.description,
            content: this.event.content,
            eventDate: new Date(this.event.eventDate).toISOString().slice(0, 10),
          });
        },
        error: (err) => this.error = err,
      })
    }
  }

  onSubmit() {
    console.log('OnSubmit', this.event);
    // TO-DO : IMPLEMENT
    this.eventService
  }

  ngOnDestroy(): void {
    this.paramSubscription?.unsubscribe;
    this.eventSubscription?.unsubscribe;
  }
}
