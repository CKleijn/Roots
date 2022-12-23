import { Test } from '@nestjs/testing';

import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect, Model, Types } from 'mongoose';

import { Tag, TagDocument, TagSchema } from "./tag.schema";

describe('User Schema Tests', () => {
    let mongod: MongoMemoryServer;
    let tagModel: Model<TagDocument>;

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
                MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }])
            ],
        }).compile();

        tagModel = app.get<Model<TagDocument>>(getModelToken(Tag.name));
        await tagModel.ensureIndexes();
    });

    afterAll(async () => {
        await disconnect();
        await mongod.stop();
    });

    describe('Required fields', () => {
        it('has a required name', () => {
            const model = new tagModel();
            
            const err = model.validateSync();

            expect(err.errors.name).toBeInstanceOf(Error);
        });

        it('has a required organization', () => {
            const model = new tagModel();

            const err = model.validateSync();

            expect(err.errors.organization).toBeInstanceOf(Error);
        });

    });

    describe('Check name input is unique', () => {
        it('has a unique emailAddress', async () => {
            const original = new tagModel({ _id: new Types.ObjectId(), name: 'TestU', organization: new Types.ObjectId()});
            const duplicate = new tagModel({ _id: new Types.ObjectId(), name: 'Hello', organization: new Types.ObjectId()});
            
            await original.save();
            
            await expect(duplicate.save()).resolves.not.toThrowError();
        });
        
        it('does not have unique name', async () => {
            const original = new tagModel({ _id: new Types.ObjectId(), name: 'Test', organization: new Types.ObjectId()});
            const duplicate = new tagModel({ _id: new Types.ObjectId(), name: 'Test', organization: new Types.ObjectId()});

            await original.save();

            await expect(duplicate.save()).rejects.toThrow();
        });
    });

})