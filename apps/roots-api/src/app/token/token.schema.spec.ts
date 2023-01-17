import { Test } from '@nestjs/testing';

import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect, Model } from 'mongoose';

import { Token, TokenDocument, TokenSchema } from "./token.schema";

describe('Token Schema Tests', () => {
    let mongod: MongoMemoryServer;
    let tokenModel: Model<TokenDocument>;

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
                MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }])
            ],
        }).compile();

        tokenModel = app.get<Model<TokenDocument>>(getModelToken(Token.name));
        await tokenModel.ensureIndexes();
    });

    afterAll(async () => {
        await disconnect();
        await mongod.stop();
    });

    describe('Required fields', () => {
        it('has a required type', () => {
            const model = new tokenModel();

            const err = model.validateSync();

            expect(err.errors.type).toBeInstanceOf(Error);
            expect(err.errors.type.message).toEqual(
                'Path `type` is required.'
            );
        });

        it('has a required expirationDate', () => {
            const model = new tokenModel();

            const err = model.validateSync();

            expect(err.errors.expirationDate).toBeInstanceOf(Error);
            expect(err.errors.expirationDate.message).toEqual(
                'Path `expirationDate` is required.'
            );
        });

    });

})