import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect, Model, Types } from 'mongoose';
import {
  Organization,
  OrganizationDocument,
  OrganizationSchema,
} from '../organization/organization.schema';
import { OrganizationService } from '../organization/organization.service';
import { User, UserDocument, UserSchema } from '../user/user.schema';
import { Token, TokenDocument, TokenSchema } from './token.schema';
import { TokenService } from './token.service';

jest.useRealTimers();

const userId = new Types.ObjectId();
const organizationId = new Types.ObjectId();
const token1Id = new Types.ObjectId();
const token2Id = new Types.ObjectId();
const expirationDate = new Date(Date.now() + 3600 * 1000 * 24);
const oldExpirationDate = new Date(Date.now() - 3600 * 1000 * 24);

describe('TokenService', () => {
  let service: TokenService;
  let mongod: MongoMemoryServer;
  let mongoc: MongoClient;
  let userModel: Model<UserDocument>;
  let tokenModel: Model<TokenDocument>;
  let organizationModel: Model<OrganizationDocument>;

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
        MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forRootAsync({
          useFactory: async () => {
            mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
            return { uri };
          },
        }),
        MongooseModule.forFeature([
          { name: Organization.name, schema: OrganizationSchema },
        ]),
      ],
      providers: [TokenService, OrganizationService],
    }).compile();

    service = app.get<TokenService>(TokenService);
    userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
    tokenModel = app.get<Model<TokenDocument>>(getModelToken(Token.name));
    organizationModel = app.get<Model<OrganizationDocument>>(
      getModelToken(Organization.name)
    );

    mongoc = new MongoClient(uri);
    await mongoc.connect();
  });

  beforeEach(async () => {
    await mongoc.db('test').collection('users').deleteMany({});
    await mongoc.db('test').collection('organizations').deleteMany({});
    await mongoc.db('test').collection('tokens').deleteMany({});

    const organization = new organizationModel({
      _id: organizationId,
      name: 'TestOrganization',
      emailDomain: 'organization1.com',
    });

    const user = new userModel({
      _id: userId,
      firstname: 'Harry',
      lastname: 'Potter',
      emailAddress: 'harrypotter@organization2.com',
      password: 'password',
      isActive: true,
      createdAt: new Date(),
      lastLoginTimestamp: new Date(),
      organization: organizationId._id.toString(),
    });

    const token1 = new tokenModel({
      _id: token1Id,
      type: 'verification',
      verificationCode: '123456',
      expirationDate: expirationDate,
      userId: userId.toString(),
    });

    const token2 = new tokenModel({
      _id: token2Id,
      type: 'password_reset',
      verificationCode: '',
      expirationDate: oldExpirationDate,
      userId: userId.toString(),
    });

    await Promise.all([
      organization.save(),
      user.save(),
      token1.save(),
      token2.save(),
    ]);
  });

  afterAll(async () => {
    await mongoc.close();
    await disconnect();
    await mongod.stop();
  });

  describe('getById', () => {
    it('should retrieve token by id', async () => {
      const results = await service.getById(token1Id.toString());

      expect(results).toBeInstanceOf(Object);

      expect(results).toHaveProperty('_id');
      expect(results._id).toEqual(token1Id);

      expect(results).toHaveProperty('type');
      expect(results.type).toEqual('verification');

      expect(results).toHaveProperty('verificationCode');
      expect(results.verificationCode).toEqual('123456');

      expect(results).toHaveProperty('expirationDate');
      expect(results.expirationDate).toEqual(expirationDate);

      expect(results).toHaveProperty('userId');
      expect(results.userId).toEqual(userId.toString());
    });

    it('should retrieve another token when using a different id', async () => {
      const results = await service.getById(token2Id.toString());

      expect(results).toBeInstanceOf(Object);

      expect(results).toHaveProperty('_id');
      expect(results._id).toEqual(token2Id);

      expect(results).toHaveProperty('type');
      expect(results.type).toEqual('password_reset');

      expect(results).toHaveProperty('verificationCode');
      expect(results.verificationCode).toEqual('');

      expect(results).toHaveProperty('expirationDate');
      expect(results.expirationDate).toEqual(oldExpirationDate);

      expect(results).toHaveProperty('userId');
      expect(results.userId).toEqual(userId.toString());
    });

    it('should throw exception when given non-existing id', async () => {
      try {
        await service.getById(new Types.ObjectId().toString());
      } catch (err) {
        expect(err.message).toEqual('Token bestaat niet!');
        expect(err.status).toEqual(404);
      }
    });
  });

  describe('getByUserId', () => {
    it('should retrieve token by user id (and type)', async () => {
      const results = await service.getByUserId(
        userId.toString(),
        'verification'
      );

      expect(results).toBeInstanceOf(Object);

      expect(results).toHaveProperty('_id');
      expect(results._id).toEqual(token1Id);

      expect(results).toHaveProperty('type');
      expect(results.type).toEqual('verification');

      expect(results).toHaveProperty('verificationCode');
      expect(results.verificationCode).toEqual('123456');

      expect(results).toHaveProperty('expirationDate');
      expect(results.expirationDate).toEqual(expirationDate);

      expect(results).toHaveProperty('userId');
      expect(results.userId).toEqual(userId.toString());
    });

    it('should retrieve another token when using a different user id (and type)', async () => {
      const results = await service.getByUserId(
        userId.toString(),
        'password_reset'
      );

      expect(results).toBeInstanceOf(Object);

      expect(results).toHaveProperty('_id');
      expect(results._id).toEqual(token2Id);

      expect(results).toHaveProperty('type');
      expect(results.type).toEqual('password_reset');

      expect(results).toHaveProperty('verificationCode');
      expect(results.verificationCode).toEqual('');

      expect(results).toHaveProperty('expirationDate');
      expect(results.expirationDate).toEqual(oldExpirationDate);

      expect(results).toHaveProperty('userId');
      expect(results.userId).toEqual(userId.toString());
    });

    it('should throw exception when given non-existing id', async () => {
      try {
        await service.getById(new Types.ObjectId().toString());
      } catch (err) {
        expect(err.message).toEqual('Token bestaat niet!');
        expect(err.status).toEqual(404);
      }
    });
  });

  describe('create', () => {
    it('should create new token for given user (type: verification)', async () => {
      await service.delete(userId.toString(), 'verification');
      await service.create('verification', userId.toString());
      const results = await service.getByUserId(
        userId.toString(),
        'verification'
      );

      expect(results).toBeInstanceOf(Object);

      expect(results).toHaveProperty('_id');

      expect(results).toHaveProperty('type');
      expect(results.type).toEqual('verification');

      expect(results).toHaveProperty('verificationCode');

      expect(results).toHaveProperty('expirationDate');

      expect(results).toHaveProperty('userId');
      expect(results.userId).toEqual(userId.toString());
    });

    it('should create new token for given user (type: password_reset)', async () => {
      await service.delete(userId.toString(), 'password_reset');
      await service.create('password_reset', userId.toString());
      const results = await service.getByUserId(
        userId.toString(),
        'password_reset'
      );

      expect(results).toBeInstanceOf(Object);

      expect(results).toHaveProperty('_id');

      expect(results).toHaveProperty('type');
      expect(results.type).toEqual('password_reset');

      expect(results).toHaveProperty('verificationCode');
      expect(results.verificationCode).toEqual('');

      expect(results).toHaveProperty('expirationDate');

      expect(results).toHaveProperty('userId');
      expect(results.userId).toEqual(userId.toString());
    });
  });

  describe('delete', () => {
    it('should throw exception when looking for a token that has previosly been deleted (type: verification)', async () => {
      try {
        await service.delete(new Types.ObjectId().toString(), 'verification');
        await service.getByUserId(userId.toString(), 'verification');
      } catch (err) {
        expect(err.message).toEqual('Token bestaat niet!');
        expect(err.status).toEqual(404);
      }
    });

    it('should throw exception when looking for a token that has previosly been deleted (type: password_reset)', async () => {
      try {
        await service.delete(new Types.ObjectId().toString(), 'password_reset');
        await service.getByUserId(userId.toString(), 'password_reset');
      } catch (err) {
        expect(err.message).toEqual('Token bestaat niet!');
        expect(err.status).toEqual(404);
      }
    });
  });
});
