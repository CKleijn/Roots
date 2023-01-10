import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect, Model } from 'mongoose';
import { Event, EventSchema } from './event.schema';

describe('Event schema - Unit tests', () => {
  let mongod: MongoMemoryServer;
  let eventModel: Model<Event>;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            return { uri };
          },
        }),
        MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
      ],
    }).compile();

    eventModel = app.get<Model<Event>>(getModelToken(Event.name));

    await eventModel.ensureIndexes();
  });

  afterAll(async () => {
    await disconnect();
    await mongod.stop();
  });

  // REQUIRED
  it('has a required title', () => {
    const model = new eventModel();

    const err = model.validateSync();
    expect(err.errors.title).toBeInstanceOf(Error);
    expect(err.errors.title.message).toEqual('Titel is verplicht!');
    expect(err.errors.title).toBeTruthy();
  });

  it('has a required description', () => {
    const model = new eventModel();

    const err = model.validateSync();

    expect(err.errors.description).toBeInstanceOf(Error);
    expect(err.errors.description.message).toEqual(
      'Beschrijving is verplicht!'
    );
    expect(err.errors.description).toBeTruthy();
  });

  it('has a required content', () => {
    const model = new eventModel();

    const err = model.validateSync();

    expect(err.errors.content).toBeInstanceOf(Error);
    expect(err.errors.content.message).toEqual('Inhoud is verplicht!');
    expect(err.errors.content).toBeTruthy();
  });

  it('has a required eventDate', () => {
    const model = new eventModel();

    const err = model.validateSync();

    expect(err.errors.eventDate).toBeInstanceOf(Error);
    expect(err.errors.eventDate.message).toEqual(
      'Gebeurtenisdatum is verplicht!'
    );
    expect(err.errors.eventDate).toBeTruthy();
  });

  // MAX LENGTH
  it('title has a max length of 75', () => {
    const model = new eventModel();
    model.title =
      'Dummy title Dummy title Dummy title Dummy title Dummy title Dummy title Dummy title Dummy title';

    const err = model.validateSync();

    expect(err.errors.title).toBeInstanceOf(Error);
    expect(err.errors.title.message).toEqual(
      'Titel mag maximaal 75 karakters bevatten!'
    );
    expect(err.errors.title).toBeTruthy();
  });

  it('description has a max length of 150', () => {
    const model = new eventModel();
    model.description =
      'Dummy description Dummy description Dummy description Dummy description Dummy description Dummy description Dummy description Dummy description Dummy description Dummy description Dummy description';

    const err = model.validateSync();

    expect(err.errors.description).toBeInstanceOf(Error);
    expect(err.errors.description.message).toEqual(
      'Beschrijving mag maximaal 150 karakters bevatten!'
    );
    expect(err.errors.description).toBeTruthy();
  });
});
