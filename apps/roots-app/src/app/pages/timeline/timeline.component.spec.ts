import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { ActivatedRoute } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { TimelineComponent } from './timeline.component';
import { EventService } from '../event/event.service';
import { AuthService } from '../auth/auth.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatChipsModule } from '@angular/material/chips';
import { TagService } from '../tag/tag.service';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;
  let events;
  let tags;
  let fakeEventServiceMock;
  let fakeTagServiceMock

  beforeEach(async () => {
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;

    events = [
      {
        _id: 1
      }
    ]

    tags = [
      {
        _id: 1
      }
    ]

    fakeEventServiceMock = {
      getEventsPerPage: jest.fn().mockReturnValue(of(events))
    }

    fakeTagServiceMock = {
      getAllTags: jest.fn().mockReturnValue(of(tags))
    }

    localStorage.setItem(
      'currentuser',
      JSON.stringify({
        _id: '63a4526e7d0829f5b8a76c71',
        firstname: '',
        lastname: '',
        emailAddress: '',
        password: '',
        access_token: '',
        organization: '63bc324283c8c465d8b1dd10',
        initials: '',
        isActive: true,
      })
    );

    await TestBed.configureTestingModule({
      declarations: [TimelineComponent, MatAutocomplete],
      providers: [
        {
          provide: EventService,
          useValue: fakeEventServiceMock
        },
        AuthService,
        {
          provide: TagService,
          useValue: fakeTagServiceMock
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 1,
              },
            },
          },
        },
      ],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot({
          positionClass: 'toast-top-right',
        }),
        ReactiveFormsModule,
        InfiniteScrollModule,
        MatChipsModule,
        MatAutocompleteModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //create component
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a list of events', () => {
    component.ngOnInit();
    expect(component.events.length).toBeGreaterThan(0)
  })
});
