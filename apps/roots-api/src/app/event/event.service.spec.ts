import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect, Model, Types } from 'mongoose';
import { Event, EventDocument, EventSchema } from '../event/event.schema';
import { Organization, OrganizationDocument, OrganizationSchema } from '../organization/organization.schema';
import { EventDto } from './event.dto';
import { EventService } from './event.service';

describe('OrganizationService', () => {
  let service: EventService;
  let mongod: MongoMemoryServer;
  let mongoc: MongoClient;
  let eventModel: Model<EventDocument>;
  let organizationModel: Model<OrganizationDocument>;
  let eventOneId;
  let eventTwoId;
  let organizationId;

  beforeAll(async () => {
    let uri: string;

    const app = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
            return { uri };
          },
        }),
        MongooseModule.forFeature([
          { name: Event.name, schema: EventSchema },
          { name: Organization.name, schema: OrganizationSchema },
        ]),
      ],
      providers: [EventService],
    }).compile();

    service = app.get<EventService>(EventService);
    eventModel = app.get<Model<EventDocument>>(
      getModelToken(Event.name)
    );
    organizationModel = app.get<Model<OrganizationDocument>>(
        getModelToken(Organization.name)
    )

    mongoc = new MongoClient(uri);
    await mongoc.connect();
  });

  beforeEach(async () => {
    await mongoc.db('test').collection('organizations').deleteMany({});

    const eventOne = new eventModel({
      title: 'Event1',
      description: 'Event1',
      content:'ContentOne',
      tags:[new Types.ObjectId()],
      eventDate:new Date(),
      isActive:true
    });

    const eventTwo = new eventModel({
        title: 'Event2',
        description: 'Event2',
        content:'ContentTwo',
        tags:[new Types.ObjectId(),new Types.ObjectId()],
        eventDate:new Date(),
        isActive:false
    });

    await eventOne.save();
    await eventTwo.save();

    eventOneId = eventOne._id;
    eventTwoId = eventTwo._id;

    const organization = new organizationModel({
        name:'Organization',
        emailDomain:'org.nl',
        events:[eventOneId,eventTwoId]
    })
    
    await organization.save()
    organizationId = organization._id;

  });

  afterAll(async () => {
    await mongoc.close();
    await disconnect();
    await mongod.stop();
  });


  describe('getAll', () => {

    it('should retrieve all events from organization', async () => {
      const results = await service.getAll(organizationId);
        expect(results.length).toBe(2);
        expect(results[1].title).toEqual('Event1');
        expect(results[1].description).toEqual('Event1');
        expect(results[1].tags.length).toBe(1);
        expect(results[1].eventDate).toBeDefined();
        expect(results[1].isActive).toBe(true);
        expect(results[0].title).toEqual('Event2');
        expect(results[0].description).toEqual('Event2');
        expect(results[0].tags.length).toBe(2);
        expect(results[0].eventDate).toBeDefined();
        expect(results[0].isActive).toBe(false);
    });
    
    it('should retrieve no events from organization', async () => {
        await eventModel.deleteMany({})
        await organizationModel.findByIdAndUpdate({_id:organizationId},{$set :{events: []}})
        const results = await service.getAll(organizationId);
        expect(results).toBeUndefined();
    })

   
  });

//   describe('getPerPage', () => {
//     it
//   })

  describe('getById', () => {
    it('Should return event details', async () => {
        const result = await service.getById(eventOneId);
        expect(result).toBeDefined();
        expect(result.title).toEqual('Event1')
        expect(result.description).toEqual('Event1')
        expect(result.tags.length).toEqual(1)
        expect(result.isActive).toEqual(true)
    });

    it('Schould return no event details', async () => {
        await expect(service.getById('63c16aec4058ed4e3206bd2b'))
            .rejects
            .toEqual(new HttpException('Deze gebeurtenis bestaat niet!',HttpStatus.NOT_FOUND))
    })
  });
  describe('create', () => {
    it('Should return new event', async () => {
        const newEvent: EventDto = {
            title: 'Event3',
            description: 'Event3',
            content:'ContentThree',
            tags:[new Types.ObjectId()],
            eventDate:new Date(),
            isActive:true
        }
        const result = await service.create(organizationId,newEvent)
        expect(result).toBeDefined();
        expect(result.events.length).toEqual(3);
        
        const results = await service.getAll(organizationId);
        expect(results[0].title).toEqual(newEvent.title);
        expect(results[0].description).toEqual(newEvent.description);
        expect(results[0].tags.length).toEqual(1);
        expect(results[0].eventDate).toEqual(newEvent.eventDate);
        expect(results[0].isActive).toEqual(newEvent.isActive);
    });

    it('Schould return not event details because organization does not exist', async () => {
        const newEvent: EventDto = {
            title: 'Event3',
            description: 'Event3',
            content:'ContentThree',
            tags:[new Types.ObjectId()],
            eventDate:new Date(),
            isActive:true
        }
        await expect(service.create('63c16aec4058ed4e3206bd2b',newEvent))
            .rejects
            .toEqual(new HttpException('Dit bedrijf bestaat niet!',HttpStatus.NOT_FOUND))
    })
  });
  describe('update', () => {
    it('should return updated event', async () => {
        const updatedEvent: EventDto = {
            title: 'EventTwo',
            description: 'EventTwo',
            content:'ContentTwo',
            tags:[new Types.ObjectId()],
            eventDate:new Date(),
            isActive:true
        }
        const result = await service.update(eventOneId,updatedEvent);
        expect(result).toBeDefined();
        expect(result.title).toEqual(updatedEvent.title);
        expect(result.description).toEqual(updatedEvent.title);
        expect(result.content).toEqual(updatedEvent.content);
        expect(result.tags).toEqual(updatedEvent.tags);
        expect(result.eventDate).toEqual(updatedEvent.eventDate);
        expect(result.isActive).toEqual(updatedEvent.isActive);
    });

    it('should not return updated event because event does not exist', async () => {
        const updatedEvent: EventDto = {
            title: 'EventTwo',
            description: 'EventTwo',
            content:'ContentTwo',
            tags:[new Types.ObjectId()],
            eventDate:new Date(),
            isActive:true
        }
        await expect(service.update('63c16aec4058ed4e3206bd2b',updatedEvent))
            .rejects
            .toEqual(new HttpException('Deze gebeurtenis bestaat niet!',HttpStatus.NOT_FOUND))
    });

  });
  describe('archive', () => {
    it('Should return archived event', async () => {
        const result = await service.archive(eventOneId,false);
        expect(result).toBeDefined();
        expect(result.isActive).not.toEqual(true);

        const event = await service.getById(eventOneId);
        expect(event).toBeDefined();
        expect(event.isActive).toEqual(false);
    })

    it('Archiving failed', async () => {
        await expect(service.archive('63c16aec4058ed4e3206bd2b',false))
        .rejects
        .toEqual(new HttpException('Deze gebeurtenis bestaat niet!',HttpStatus.NOT_FOUND))

        const event = await service.getById(eventOneId);
        expect(event).toBeDefined();
        expect(event.isActive).toEqual(true);
    })

    it('Should return dearchived event', async () => {
        const result = await service.archive(eventTwoId,true);
        expect(result).toBeDefined();
        expect(result.isActive).not.toEqual(false);

        const event = await service.getById(eventOneId);
        expect(event).toBeDefined();
        expect(event.isActive).toEqual(true);
    });

    it('Dearchiving failed', async () => {
        await expect(service.archive('63c16aec4058ed4e3206bd2b',true))
        .rejects
        .toEqual(new HttpException('Deze gebeurtenis bestaat niet!',HttpStatus.NOT_FOUND))

        const event = await service.getById(eventOneId);
        expect(event).toBeDefined();
        expect(event.isActive).toEqual(true);
    })
  });    
});
