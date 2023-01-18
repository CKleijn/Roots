/* eslint-disable @typescript-eslint/no-var-requires */
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../../environments/environment.prod';
import { EventService } from './event.service';
import { Event } from './event.model';
import { Types } from 'mongoose';
import { Organization, Tag, Event as EventData } from '@roots/data';
import { ToastrModule, ToastrService } from 'ngx-toastr';

const organizationId = new Types.ObjectId('6391333037ceb01d296c5981');
const tagIdOne = new Types.ObjectId('6391333037ceb01d296c5982');
const tagIdTwo = new Types.ObjectId('6391333037ceb01d296c5983');
const eventIdOne = new Types.ObjectId('6391333037ceb01d296c5984');
const eventIdTwo = new Types.ObjectId('6391333037ceb01d296c5985');
const eventIdThree = new Types.ObjectId('6391333037ceb01d296c5986');

fdescribe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;
  let dummyTags: Tag[] = [];
  let dummyOrgs: Organization[] = [];
  let dummyEvents: EventData[] = [];
  let dummyEvent: Event;
  // let httpClient: HttpClient;
  // let authService: AuthService;
  // let toastr: ToastrService;

  beforeEach(() => {
    jest.setTimeout(600000);
    dummyEvents = [
      {
        _id: eventIdOne,
        title: 'Mock Title Event',
        description: 'Mock Description Event',
        content: 'Mock Content Event',
        tags: [
          tagIdOne,
        ],
        eventDate: new Date(),
        isActive: true,
      },
      {
        _id: eventIdTwo,
        title: 'Mock Title Event 2',
        description: 'Mock Description Event 2',
        content: 'Mock Content Event 2',
        tags: [
          tagIdOne,
          tagIdTwo
        ],
        eventDate: new Date(),
        isActive: true,
      },
      {
        _id: eventIdThree,
        title: 'Mock Title Event 3',
        description: 'Mock Description Event 3',
        content: 'Mock Content Event 3',
        tags: [
          tagIdTwo
        ],
        eventDate: new Date(),
        isActive: true,
      },
    ];

    dummyEvent = {
      // _id: eventIdTwo,
      title: 'Mock Title Event 2',
      description: 'Mock Description Event 2',
      content: 'Mock Content Event 2',
      tags: [
        // tagIdOne,
        // tagIdTwo
      ],
      eventDate: new Date(),
      isActive: true,
    };

    dummyTags = [
      {
        _id: tagIdOne,
        name: 'Mock Tag One',
        organization: organizationId,
      },
      {
        _id: tagIdTwo,
        name: 'Mock Tag Two',
        organization: organizationId,
      },
    ];

    dummyOrgs = [
      {
        _id: organizationId,
        name: 'Mock Name Organization',
        emailDomain: 'organization.mock',
        events: [],
        tags: [dummyTags[0]._id, dummyTags[1]._id],
        logs: [],
      },
    ];

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [EventService],
    });

    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should return events when calling getAllEvents', (done) => {
    service.getAllEvents(organizationId.toString()).subscribe((events) => {
      expect(events.length).toBe(3);
      expect(events.at(0)?.title).toEqual(dummyEvents.at(0)?.title);
      expect(events.at(0)?.description).toEqual(dummyEvents.at(0)?.description);
      expect(events.at(0)?.content).toEqual(dummyEvents.at(0)?.content);
      expect(events.at(0)?.tags).toEqual(dummyEvents.at(0)?.tags);
      expect(events.at(0)?.eventDate).toEqual(dummyEvents.at(0)?.eventDate);
      expect(events.at(0)?.isActive).toEqual(dummyEvents.at(0)?.isActive);

      done();
    });

    const req = httpMock.expectOne(environment.SERVER_API_URL + `/events/organization/${organizationId.toString()}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyEvents);
  });

  it('should return no events when calling getAllEvents', (done) => {
    dummyEvents = [];

    service.getAllEvents(organizationId.toString()).subscribe((events) => {
      expect(events.length).toBe(0);
      done();
    });

    const req = httpMock.expectOne(environment.SERVER_API_URL + '/events/organization/' + organizationId.toString());
    expect(req.request.method).toBe('GET');
    req.flush(dummyEvents);
  });

  it('should return event when calling getEventById', (done) => {
    service.getEventById(dummyEvents[1].toString()).subscribe((event) => {
      expect(event).toBeDefined();
      expect(event.title).toEqual(dummyEvents[1].title);
      expect(event.description).toEqual(dummyEvents[1].description);
      expect(event.content).toEqual(dummyEvents[1].content);
      expect(event.tags).toEqual(dummyEvents[1].tags);
      expect(event.eventDate).toEqual(dummyEvents[1].eventDate);
      expect(event.isActive).toEqual(dummyEvents[1].isActive);

      done();
    });

    const req = httpMock.expectOne(
      environment.SERVER_API_URL + '/events/' + dummyEvents[1].toString()
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyEvents[1]);
  });

  it('should return no event when calling getEventById', (done) => {
    dummyEvents = [];

    service.getEventById('undefined').subscribe((event) => {
      expect(event).toBeNull();

      done();
    });

    const req = httpMock.expectOne(
      environment.SERVER_API_URL + '/events/' + undefined
    );
    expect(req.request.method).toBe('GET');
    req.flush(null);
  });

  it('should return event when calling postEvent', (done) => {
    service
      .postEvent(dummyEvent, dummyOrgs[0]._id.toString())
      .subscribe((event) => {
        expect(event).toBeDefined();
        done();
      });

    const req = httpMock.expectOne(
      environment.SERVER_API_URL + '/events/new/' + dummyOrgs[0]._id.toString()
    );
    expect(req.request.method).toBe('POST');
    req.flush(dummyEvent);
  });

  it('should return event when calling putEvent', (done) => {
    dummyEvent = {
        title: 'Mock Title Event 2 Changed',
        description: 'Mock Description Event 2',
        content: 'Mock Content Event 2',
        tags: [

        ],
        eventDate: dummyEvents[1].eventDate,
        isActive: true,
      };
  
    service
      .putEvent(dummyEvent, dummyEvents[1]._id.toString(), dummyOrgs[0]._id.toString())
      .subscribe((event) => {
        expect(event).toBeDefined();
        done();
      });

    const req = httpMock.expectOne(
      environment.SERVER_API_URL +
        '/events/' +
        dummyOrgs[0]._id.toString() +
        '/' +
        dummyEvents[1]._id.toString() +
        '/edit'
    );
    expect(req.request.method).toBe('PUT');
    req.flush(dummyEvent);
  });

  it('should return no event when calling putEvent, false eventId', (done) => {
    service
      .putEvent(dummyEvent, 'undefined', dummyOrgs[0]._id.toString())
      .subscribe((event) => {
        expect(event).toBeDefined();

        done();
      });

    const req = httpMock.expectOne(
      environment.SERVER_API_URL +
        '/events/' +
        dummyOrgs[0]._id.toString() +
        '/' +
        undefined +
        '/edit'
    );
    expect(req.request.method).toBe('PUT');
    req.flush(null);
  });

  it('should return no event when calling putEvent, false organizationId', (done) => {
    service
      .putEvent(dummyEvent, dummyEvents[1]._id.toString(), 'undefined')
      .subscribe((event) => {
        expect(event).toBeDefined();

        done();
      });

    const req = httpMock.expectOne(
      environment.SERVER_API_URL +
        '/events/' +
        undefined +
        '/' +
        dummyEvents[1]._id.toString() +
        '/edit'
    );
    expect(req.request.method).toBe('PUT');
    req.flush(null);
  });

  it('should return isActive false if archive call has been made', (done) => {
    dummyEvent = {
        title: 'Mock Title Event 2 Changed',
        description: 'Mock Description Event 2',
        content: 'Mock Content Event 2',
        tags: [

        ],
        eventDate: dummyEvents[1].eventDate,
        isActive: false,
      };
    service
      .archiveEvent(
        dummyEvent.isActive,
        dummyEvents[1]._id.toString(),
        dummyOrgs[0]._id.toString()
      )
      .subscribe((event) => {
        expect(event.isActive).toBe(false);
        expect(event.title).toEqual(dummyEvent.title);
        expect(event.description).toEqual(dummyEvent.description);
        expect(event.content).toEqual(dummyEvent.content);
        expect(event.tags).toEqual(dummyEvent.tags);
        expect(event.eventDate).toEqual(dummyEvent.eventDate);
        expect(event.isActive).toEqual(dummyEvent.isActive);
        done();
      });

    const req = httpMock.expectOne(
      environment.SERVER_API_URL + '/events/' + dummyOrgs[0]._id.toString() + '/' + dummyEvents[1]._id.toString() + '/archive?isActive=' + false
    );
    expect(req.request.method).toBe('PUT');
    req.flush(dummyEvent);
  });
});
