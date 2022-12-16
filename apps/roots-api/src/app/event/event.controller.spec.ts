import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from "./event.service";
import { EventController } from "./event.controller";
import { Event } from './event.schema';
import { CanActivate } from '@nestjs/common';
import { Public } from '../auth/auth.module';

describe('Event controller - Integration tests', () => {
    let app: TestingModule;
    let eventController: EventController;
    let eventService: EventService;
    let fakeGuard: CanActivate = { canActivate: () => true };

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [EventController],
            providers: [{
                provide: EventService,
                useValue: {
                    getAll: jest.fn(),
                    getById: jest.fn(),
                    create: jest.fn(),
                    update: jest.fn(),
                },
            }],
        })
        .overrideGuard(Public).useValue(fakeGuard)
        .compile();

        eventController = app.get<EventController>(EventController);
        eventService = app.get<EventService>(EventService);
    });

    it('should call getAll on the service', async () => {
        const exampleEvents: Event[] = [
            {
                title: 'Event title 1',
                description: 'Event description 1',
                content: 'Event content 1',
                eventDate: new Date()
            },
            {
                title: 'Event title 2',
                description: 'Event description 2',
                content: 'Event content 2',
                eventDate: new Date()
            }
        ]

        const getEvents = jest.spyOn(eventService, 'getAll')
            .mockImplementation(async () => exampleEvents);

        const results = await eventController.getAllEvents();

        expect(getEvents).toBeCalledTimes(1);
        expect(results).toHaveLength(2);
        expect(results[0]).toHaveProperty('title', exampleEvents[0].title);
        expect(results[0]).toHaveProperty('description', exampleEvents[0].description);
        expect(results[0]).toHaveProperty('content', exampleEvents[0].content);
        expect(results[0]).toHaveProperty('eventDate', exampleEvents[0].eventDate);
        expect(results[1]).toHaveProperty('title', exampleEvents[1].title);
        expect(results[1]).toHaveProperty('description', exampleEvents[1].description);
        expect(results[1]).toHaveProperty('content', exampleEvents[1].content);
        expect(results[1]).toHaveProperty('eventDate', exampleEvents[1].eventDate);
    });

    it('should call getById on the service', async () => {
        const exampleEvent: Event = {
            title: 'Event title 1',
            description: 'Event description 1',
            content: 'Event content 1',
            eventDate: new Date()
        }

        const getEventById = jest.spyOn(eventService, 'getById')
            .mockImplementation(async () => exampleEvent);

        const eventId = '639a6d184362b5279e5094a0';

        const result = await eventController.getEventById(eventId);

        expect(getEventById).toBeCalledTimes(1);
        expect(result).toHaveProperty('title', exampleEvent.title);
        expect(result).toHaveProperty('description', exampleEvent.description);
        expect(result).toHaveProperty('content', exampleEvent.content);
        expect(result).toHaveProperty('eventDate', exampleEvent.eventDate);
    });

    it('should call create on the service', async () => {
        const exampleEvent: Event = {
            title: 'Event title 1',
            description: 'Event description 1',
            content: 'Event content 1',
            eventDate: new Date()
        }

        const createEvent = jest.spyOn(eventService, 'create')
            .mockImplementation(async () => exampleEvent);

        const companyId = '63988b78e1b33b129a8b04c3';

        const result: any = await eventController.createEvent(companyId, exampleEvent);

        expect(createEvent).toBeCalledTimes(1);
        expect(result.message).toEqual('De gebeurtenis is succesvol aangemaakt!');
        expect(result.status).toEqual(201);
    });

    it('should call update on the service', async () => {
        const exampleEvent: Event = {
            title: 'Event title 1',
            description: 'Event description 2',
            content: 'Event content 1',
            eventDate: new Date()
        }

        const updateEvent = jest.spyOn(eventService, 'update')
            .mockImplementation(async () => exampleEvent);

        const companyId = '63988b78e1b33b129a8b04c3';
        const eventId = '639a6d184362b5279e5094a0';

        const result: any = await eventController.updateEvent(companyId, eventId, exampleEvent);

        expect(updateEvent).toBeCalledTimes(1);
        expect(result.message).toEqual('De gebeurtenis is succesvol aangepast!');
        expect(result.status).toEqual(200);
    });
});