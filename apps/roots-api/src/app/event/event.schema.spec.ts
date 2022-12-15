import { Test } from '@nestjs/testing';
import { Model, disconnect } from 'mongoose';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Event, EventSchema } from "./event.schema";

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
                MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }])
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
        expect(err.errors.title.message).toEqual('Title is required!');
        expect(err.errors.title).toBeTruthy();
    });

    it('has a required description', () => {
        const model = new eventModel();

        const err = model.validateSync();

        expect(err.errors.description).toBeInstanceOf(Error);
        expect(err.errors.description.message).toEqual('Description is required!');
        expect(err.errors.description).toBeTruthy();
    });

    it('has a required content', () => {
        const model = new eventModel();

        const err = model.validateSync();

        expect(err.errors.content).toBeInstanceOf(Error);
        expect(err.errors.content.message).toEqual('Content is required!');
        expect(err.errors.content).toBeTruthy();
    });

    it('has a required eventDate', () => {
        const model = new eventModel();

        const err = model.validateSync();

        expect(err.errors.eventDate).toBeInstanceOf(Error);
        expect(err.errors.eventDate.message).toEqual('Date is required!');
        expect(err.errors.eventDate).toBeTruthy();
    });

    // MAX LENGTH
    it('title has a max length of 75', () => {
        const model = new eventModel();
        model.title = 'Dummy title Dummy title Dummy title Dummy title Dummy title Dummy title Dummy title Dummy title';

        const err = model.validateSync();

        expect(err.errors.title).toBeInstanceOf(Error);
        expect(err.errors.title.message).toEqual('Title can be maximal 75 characters!');
        expect(err.errors.title).toBeTruthy();
    })

    it('description has a max length of 150', () => {
        const model = new eventModel();
        model.description = 'Dummy description Dummy description Dummy description Dummy description Dummy description Dummy description Dummy description Dummy description Dummy description Dummy description Dummy description';

        const err = model.validateSync();

        expect(err.errors.description).toBeInstanceOf(Error);
        expect(err.errors.description.message).toEqual('Description can be maximal 150 characters!');
        expect(err.errors.description).toBeTruthy();
    })
});