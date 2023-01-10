import { JwtService } from '@nestjs/jwt';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect, Model } from 'mongoose';
import {
  Organization,
  OrganizationDocument,
  OrganizationSchema,
} from '../organization/organization.schema';
import { OrganizationService } from '../organization/organization.service';
import { UserService } from '../user/user.service';
import { User, UserDocument, UserSchema } from './../user/user.schema';
import { AuthService } from './auth.service';

describe('UserService', () => {
  let service: AuthService;
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
        MongooseModule.forFeature([
          { name: Organization.name, schema: OrganizationSchema },
        ]),
      ],
      providers: [AuthService, JwtService, OrganizationService, UserService],
    }).compile();

    service = app.get<AuthService>(AuthService);
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

    const user = new userModel({
      firstname: 'test',
      lastname: 'tester',
      emailAddress: 'test@test.com',
      password: await bcrypt.hashSync('password', 10),
    });

    const organization = new organizationModel({
      name: 'TestOrganization',
      emailDomain: 'test.com',
    });

    await Promise.all([user.save(), organization.save()]);
  });

  afterAll(async () => {
    await mongoc.close();
    await disconnect();
    await mongod.stop();
  });

  describe('login', () => {
    it('should return login response', async () => {
      const results = await service.login({
        username: 'test@test.com',
        password: 'password',
      });

      expect(results).toHaveProperty('_id');
      expect(results).toHaveProperty('firstname');
      expect(results).toHaveProperty('lastname');
      expect(results).toHaveProperty('emailAddress');
      expect(results).toHaveProperty('organization');
      expect(results).toHaveProperty('access_token');
    });

    it('should return error response when login is wrong', async () => {
      try {
        await service.validateUser('test@test.com', 'WRONGPASSWORD');
      } catch (err) {
        expect(err.message).toEqual('Incorrecte inloggegevens!');
      }
    });

    it('should return error response when accoint is deactivated', async () => {
      const user = await userModel.findOne({});
      user.isActive = false;
      await user.save();

      try {
        await service.validateUser('test@test.com', 'password');
      } catch (err) {
        expect(err.message).toEqual('Jouw account is gedeactiveerd!');
      }
    });
  });
});
