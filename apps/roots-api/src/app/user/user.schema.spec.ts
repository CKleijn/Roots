import { Test } from '@nestjs/testing';

import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect, Model, Types } from 'mongoose';

import { User, UserDocument, UserSchema } from "./user.schema";

describe('User Schema Tests', () => {
    let mongod: MongoMemoryServer;
    let userModel: Model<UserDocument>;

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
                MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
            ],
        }).compile();

        userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
        await userModel.ensureIndexes();
    });

    afterAll(async () => {
        await disconnect();
        await mongod.stop();
    });

    describe('Required fields', () => {
        it('has a required emailAddress', () => {
            const model = new userModel();
            
            const err = model.validateSync();

            expect(err.errors.emailAddress).toBeInstanceOf(Error);
        });

        it('has a required firstName', () => {
            const model = new userModel();

            const err = model.validateSync();

            expect(err.errors.firstname).toBeInstanceOf(Error);
        });

        it('has a required lastName', () => {
            const model = new userModel();

            const err = model.validateSync();

            expect(err.errors.lastname).toBeInstanceOf(Error);
        });
        
        it('has a required password', () => {
            const model = new userModel();

            const err = model.validateSync();

            expect(err.errors.password).toBeInstanceOf(Error);
        });
    });

    describe('Check email input is unique', () => {
        it('has a unique emailAddress', async () => {
            const original = new userModel({ _id: new Types.ObjectId(), firstname: 'Test', lastname: 'Doe', emailAddress: 't.doe@gmail.com', password: '12345', organization: null });
            const duplicate = new userModel({ _id: new Types.ObjectId(), firstname: 'Rob', lastname: 'Doe', emailAddress: 'r.doe@gmail.com', password: '12345', organization: null });
            
            await original.save();
            
            await expect(duplicate.save()).resolves.not.toThrowError();
        });
        
        it('does not have unique emailAddress', async () => {
            const original = new userModel({_id: new Types.ObjectId(), firstname: 'John', lastname:'Doe', emailAddress:'j.doe@gmail.com',password:'12345',organization:null   });
            const duplicate = new userModel({_id: new Types.ObjectId(), firstname: 'John', lastname:'Doe', emailAddress:'j.doe@gmail.com',password:'12345',organization:null   });

            await original.save();

            await expect(duplicate.save()).rejects.toThrow();
        });
    });

    describe('Check email input is valid', () => {
        it('has a correct emailAddress', async () => {
            const model = new userModel({ _id: new Types.ObjectId(), firstname: 'Test', lastname: 'Doe', emailAddress: 't.doe@gmail.com', password: '12345', organization: null });
            
            const err = model.validateSync();
            
            expect(err?.errors.emailAddress).not.toBeInstanceOf(Error);
        });
        
        it('does not have correct emailAddress', async () => {
            const model = new userModel({_id: new Types.ObjectId(), firstname: 'John', lastname:'Doe', emailAddress:'.jdoegom',password:'12345',organization:null   });
            
            const err = model.validateSync();
            
            expect(err.errors.emailAddress).toBeInstanceOf(Error);
        });
    });
})