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
import { User, UserDocument, UserSchema } from './user.schema';
import { UserService } from './user.service';

jest.useRealTimers();

const user1Id = new Types.ObjectId();
const user2Id = new Types.ObjectId();
const user3Id = new Types.ObjectId();
const organization1Id = new Types.ObjectId();
const organization2Id = new Types.ObjectId();
const lastLoginTimestamp = new Date();

describe('OrganizationService', () => {
  let service: UserService;
  let mongod: MongoMemoryServer;
  let mongoc: MongoClient;
  let userModel: Model<UserDocument>;
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
      providers: [UserService, OrganizationService],
    }).compile();

    service = app.get<UserService>(UserService);
    userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
    organizationModel = app.get<Model<OrganizationDocument>>(
      getModelToken(Organization.name)
    );

    mongoc = new MongoClient(uri);
    await mongoc.connect();
  });

  beforeEach(async () => {
    await mongoc.db('test').collection('users').deleteMany({});
    await mongoc.db('test').collection('organizations').deleteMany({});

    const organization1 = new organizationModel({
      _id: organization1Id,
      name: 'TestOrganization',
      emailDomain: 'organization1.com',
    });

    const organization2 = new organizationModel({
      _id: organization2Id,
      name: 'TestOrganization',
      emailDomain: 'organization2.com',
    });

    const user1 = new userModel({
      _id: user1Id,
      firstname: 'Luke',
      lastname: 'Skywalker',
      emailAddress: 'lukeskywalker@organization1.com',
      password: 'password',
      isActive: true,
      createdAt: new Date(),
      lastLoginTimestamp: lastLoginTimestamp,
      organization: organization1._id.toString(),
    });

    const user2 = new userModel({
      _id: user2Id,
      firstname: 'Harry',
      lastname: 'Potter',
      emailAddress: 'harrypotter@organization2.com',
      password: 'password',
      isActive: true,
      createdAt: new Date(),
      lastLoginTimestamp: lastLoginTimestamp,
      organization: organization2._id.toString(),
    });

    const user3 = new userModel({
      _id: user3Id,
      firstname: 'Steve',
      lastname: 'Rogers',
      emailAddress: 'captain@organization2.com',
      password: 'password',
      isActive: true,
      createdAt: new Date(),
      lastLoginTimestamp: lastLoginTimestamp,
      organization: organization2._id.toString(),
    });

    await Promise.all([
      organization1.save(),
      organization2.save(),
      user1.save(),
      user2.save(),
      user3.save(),
    ]);
  });

  afterAll(async () => {
    await mongoc.close();
    await disconnect();
    await mongod.stop();
  });

  describe('findByEmailAddress', () => {
    it('should retrieve user by emailaddress', async () => {
      const results = await service.findByEmailAddress(
        'lukeskywalker@organization1.com'
      );

      expect(results).toBeInstanceOf(Object);
      expect(results).toHaveProperty('_id');
      expect(results.firstname).toEqual('Luke');
      expect(results.lastname).toEqual('Skywalker');
      expect(results.emailAddress).toEqual('lukeskywalker@organization1.com');
      expect(results.password).toEqual('password');
      expect(results.isActive).toEqual(true);
      expect(results).toHaveProperty('createdAt');
      expect(results).toHaveProperty('lastLoginTimestamp');
      expect(results).toHaveProperty('organization');
    });

    it('should retrieve another user by a different emailaddress', async () => {
      const results = await service.findByEmailAddress(
        'harrypotter@organization2.com'
      );

      expect(results).toBeInstanceOf(Object);
      expect(results).toHaveProperty('_id');
      expect(results.firstname).toEqual('Harry');
      expect(results.lastname).toEqual('Potter');
      expect(results.emailAddress).toEqual('harrypotter@organization2.com');
      expect(results.password).toEqual('password');
      expect(results.isActive).toEqual(true);
      expect(results).toHaveProperty('createdAt');
      expect(results).toHaveProperty('lastLoginTimestamp');
      expect(results).toHaveProperty('organization');
    });

    it('should throw exception when given non-existing emailaddress', async () => {
      try {
        await service.findByEmailAddress('nonexisting@emaildomain.com');
      } catch (err) {
        expect(err.message).toEqual('Gebruiker bestaat niet!');
        expect(err.status).toEqual(404);
      }
    });
  });

  describe('getById', () => {
    it('should retrieve user by id', async () => {
      const results = await service.getById(user1Id.toString());

      expect(results).toBeInstanceOf(Object);
      expect(results).toHaveProperty('_id');
      expect(results.firstname).toEqual('Luke');
      expect(results.lastname).toEqual('Skywalker');
      expect(results.emailAddress).toEqual('lukeskywalker@organization1.com');
      expect(results.password).toEqual('password');
      expect(results.isActive).toEqual(true);
      expect(results).toHaveProperty('createdAt');
      expect(results).toHaveProperty('lastLoginTimestamp');
      expect(results.organization).toEqual(organization1Id.toString());
    });

    it('should retrieve another user with a different id', async () => {
      const results = await service.getById(user2Id.toString());

      expect(results).toBeInstanceOf(Object);
      expect(results).toHaveProperty('_id');
      expect(results.firstname).toEqual('Harry');
      expect(results.lastname).toEqual('Potter');
      expect(results.emailAddress).toEqual('harrypotter@organization2.com');
      expect(results.password).toEqual('password');
      expect(results.isActive).toEqual(true);
      expect(results).toHaveProperty('createdAt');
      expect(results).toHaveProperty('lastLoginTimestamp');
      expect(results.organization).toEqual(organization2Id.toString());
    });

    it('should throw exception when given non-existing id', async () => {
      try {
        await service.getById(new Types.ObjectId().toString());
      } catch (err) {
        expect(err.message).toEqual('Gebruiker bestaat niet!');
        expect(err.status).toEqual(404);
      }
    });
  });

  describe('getAllParticipants', () => {
    it('should retrieve all employees from first organization', async () => {
      const results = await service.getAllParticipants(
        organization1Id.toString()
      );

      expect(results).toHaveLength(1);
      expect(results[0]).toBeInstanceOf(Object);
      expect(results[0]._id).toEqual(user1Id);
      expect(results[0].firstname).toEqual('Luke');
      expect(results[0].lastname).toEqual('Skywalker');
      expect(results[0].emailAddress).toEqual(
        'lukeskywalker@organization1.com'
      );
      expect(results[0].password).toEqual('password');
      expect(results[0].isActive).toEqual(true);
      expect(results[0]).toHaveProperty('createdAt');
      expect(results[0]).toHaveProperty('lastLoginTimestamp');
      expect(results[0].organization).toEqual(organization1Id.toString());
    });

    it('should retrieve all employees from second organization', async () => {
      const results = await service.getAllParticipants(
        organization2Id.toString()
      );

      expect(results).toHaveLength(2);

      expect(results[0]).toBeInstanceOf(Object);
      expect(results[0].firstname).toEqual('Harry');
      expect(results[0].lastname).toEqual('Potter');
      expect(results[0].emailAddress).toEqual('harrypotter@organization2.com');
      expect(results[0].password).toEqual('password');
      expect(results[0].isActive).toEqual(true);
      expect(results[0]).toHaveProperty('createdAt');
      expect(results[0]).toHaveProperty('lastLoginTimestamp');
      expect(results[0].organization).toEqual(organization2Id.toString());

      expect(results[1]).toBeInstanceOf(Object);
      expect(results[1].firstname).toEqual('Steve');
      expect(results[1].lastname).toEqual('Rogers');
      expect(results[1].emailAddress).toEqual('captain@organization2.com');
      expect(results[1].password).toEqual('password');
      expect(results[1].isActive).toEqual(true);
      expect(results[1]).toHaveProperty('createdAt');
      expect(results[1]).toHaveProperty('lastLoginTimestamp');
      expect(results[1].organization).toEqual(organization2Id.toString());
    });

    it('should retrieve 0 employees when organization doesnt exists', async () => {
      const results = await service.getAllParticipants(
        new Types.ObjectId().toString()
      );

      expect(results).toHaveLength(0);
    });
  });

  describe('setLastLoginTimeStamp', () => {
    it('should change the timestamp of the last login for specified user', async () => {
      const results = await service.setLastLoginTimeStamp(user1Id.toString());

      expect(results).toBeInstanceOf(Object);
      expect(results).toHaveProperty('_id');
      expect(results.firstname).toEqual('Luke');
      expect(results.lastname).toEqual('Skywalker');
      expect(results.emailAddress).toEqual('lukeskywalker@organization1.com');
      expect(results.password).toEqual('password');
      expect(results.isActive).toEqual(true);
      expect(results).toHaveProperty('createdAt');
      expect(results).toHaveProperty('lastLoginTimestamp');
      expect(results.organization).toEqual(organization1Id.toString());

      expect(results.lastLoginTimestamp.getTime()).toBeGreaterThanOrEqual(
        lastLoginTimestamp.getTime()
      );
    });

    it('should throw exception when given non-existing id', async () => {
      try {
        await service.setLastLoginTimeStamp(new Types.ObjectId().toString());
      } catch (err) {
        expect(err.message).toEqual('Gebruiker bestaat niet!');
        expect(err.status).toEqual(404);
      }
    });
  });

  describe('status', () => {
    it('should change the status of the last login for specified user', async () => {
      const results = await service.status(user3Id.toString(), {
        user: { _id: user2Id.toString(), organization: organization2Id },
      });

      expect(results).toBeInstanceOf(Object);
      expect(results._id).toEqual(user3Id);
      expect(results.firstname).toEqual('Steve');
      expect(results.lastname).toEqual('Rogers');
      expect(results.emailAddress).toEqual('captain@organization2.com');
      expect(results.password).toEqual('password');
      expect(results.isActive).toEqual(false);
      expect(results).toHaveProperty('createdAt');
      expect(results).toHaveProperty('lastLoginTimestamp');
      expect(results.organization).toEqual(organization2Id.toString());
    });

    it('should throw exception when given id of user from a different organization', async () => {
      try {
        await service.status(user1Id.toString(), {
          user: { _id: user2Id.toString(), organization: organization2Id },
        });
      } catch (err) {
        expect(err.message).toEqual(
          'Je mag alleen gebruikers van activeren/deactiveren van het bedrijf waar je werkt!'
        );
        expect(err.status).toEqual(400);
      }
    });

    it('should throw exception when your own id has been given', async () => {
      try {
        await service.status(user1Id.toString(), {
          user: { _id: user1Id.toString(), organization: organization1Id },
        });
      } catch (err) {
        expect(err.message).toEqual(
          'Je mag jouw eigen account niet activeren/deactiveren!'
        );
        expect(err.status).toEqual(400);
      }
    });
  });

  describe('validate', () => {
    it('should throw exception when emailaddress is already in use', async () => {
      try {
        await service.validate({
          emailAddress: 'captain@organization2.com',
        });
      } catch (err) {
        expect(err.message).toEqual('Het e-mailadres is al in gebruik!');
        expect(err.status).toEqual(400);
      }
    });
  });
});
