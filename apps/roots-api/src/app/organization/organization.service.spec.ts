import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect, Model } from 'mongoose';
import { EventSchema } from '../event/event.schema';
import { CreateOrganizationDTO } from './organization.dto';
import {
  Organization,
  OrganizationDocument,
  OrganizationSchema,
} from './organization.schema';
import { OrganizationService } from './organization.service';

describe('OrganizationService', () => {
  let service: OrganizationService;
  let mongod: MongoMemoryServer;
  let mongoc: MongoClient;
  let organizationModel: Model<OrganizationDocument>;
  let organizationOneId;
  let organizationTwoId;

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
          { name: Organization.name, schema: OrganizationSchema },
        ]),
      ],
      providers: [OrganizationService],
    }).compile();

    service = app.get<OrganizationService>(OrganizationService);
    organizationModel = app.get<Model<OrganizationDocument>>(
      getModelToken(Organization.name)
    );

    mongoc = new MongoClient(uri);
    await mongoc.connect();
  });

  beforeEach(async () => {
    await mongoc.db('test').collection('organizations').deleteMany({});

    const organizationOne = new organizationModel({
      name: 'Organization1',
      emailDomain: 'organization1.com',
    });

    const organizationTwo = new organizationModel({
      name: 'Organization2',
      emailDomain: 'organization2.com',
    });

    await organizationOne.save();
    await organizationTwo.save();

    organizationOneId = organizationOne._id;
    organizationTwoId = organizationTwo._id;
  });

  afterAll(async () => {
    await mongoc.close();
    await disconnect();
    await mongod.stop();
  });

  describe('getByEmailDomain', () => {
    it('should retrieve organization1 by email domain', async () => {
      const result = await service.getByEmailDomain('organization1.com');

      expect(result.name).toEqual('Organization1');
      expect(result.emailDomain).toEqual('organization1.com');
    });

    it('should retrieve organization2 by email domain', async () => {
      const result = await service.getByEmailDomain('organization2.com');

      expect(result.name).toEqual('Organization2');
      expect(result.emailDomain).toEqual('organization2.com');
    });
    it('should throw exception when given non-existing organization emaildomain', async () => {
      try {
        await service.getByEmailDomain('nonexistingemaildomain.com');
      } catch (err) {
        expect(err.message).toEqual(
          'Er bestaat geen organisatie met het opgegeven email domein!'
        );
      }
    });
  });

  describe('getById', () => {
    it('should retrieve organization1 by id', async () => {
      const result = await service.getById(organizationOneId);

      expect(result.name).toEqual('Organization1');
      expect(result.emailDomain).toEqual('organization1.com');
    });

    it('should retrieve organization2 by id', async () => {
      const result = await service.getById(organizationTwoId);

      expect(result.name).toEqual('Organization2');
      expect(result.emailDomain).toEqual('organization2.com');
    });
    it('should throw exception when given non-existing organization id', async () => {
      try {
        await service.getById('63bc6596a420d9a3128deb5c');
      } catch (err) {
        expect(err.message).toEqual('Organisatie bestaat niet!');
      }
    });
  });

  describe('getAll', () => {
    it('should retrieve all organizations', async () => {
      const results = await service.getAll();

      expect(results).toHaveLength(2);
      expect(results.map((r) => r.name)).toContain('Organization1');
      expect(results.map((r) => r.name)).toContain('Organization2');
      expect(results.map((r) => r.emailDomain)).toContain('organization1.com');
      expect(results.map((r) => r.emailDomain)).toContain('organization2.com');
    });
  });

  describe('create', () => {
    it('should retrieve error when creating organization without a unique name', async () => {
      const organization: CreateOrganizationDTO = {
        name: 'Organization2',
        emailDomain: 'organization3.com',
      };

      try {
        await service.create(organization);
      } catch (error) {
        expect(error.status).toEqual(400);
        expect(error.message).toEqual(
          'Er bestaat al een bedrijf met de opgegeven naam!'
        );
      }
    });

    it('should retrieve error when creating organization without a unique emailDomain', async () => {
      const organization: CreateOrganizationDTO = {
        name: 'Organization3',
        emailDomain: 'organization2.com',
      };

      try {
        await service.create(organization);
      } catch (error) {
        expect(error.status).toEqual(400);
        expect(error.message).toEqual(
          'Er bestaat al een bedrijf met het opgegeven email domein!'
        );
      }
    });

    it('should retrieve create organization', async () => {
      const organization: CreateOrganizationDTO = {
        name: 'Organization3',
        emailDomain: 'organization3.com',
      };

      const result = await service.create(organization);

      expect(result.name).toEqual('Organization3');
      expect(result.emailDomain).toEqual('organization3.com');
    });
  });

  describe('validate', () => {
    it('should retrieve error when validate organization without a unique name', async () => {
      const organization: CreateOrganizationDTO = {
        name: 'Organization2',
        emailDomain: 'organization3.com',
      };

      try {
        await service.create(organization);
      } catch (error) {
        expect(error.status).toEqual(400);
        expect(error.message).toEqual(
          'Er bestaat al een bedrijf met de opgegeven naam!'
        );
      }
    });

    it('should retrieve error when validate organization without a unique emailDomain', async () => {
      const organization: CreateOrganizationDTO = {
        name: 'Organization3',
        emailDomain: 'organization2.com',
      };

      try {
        await service.create(organization);
      } catch (error) {
        expect(error.status).toEqual(400);
        expect(error.message).toEqual(
          'Er bestaat al een bedrijf met het opgegeven email domein!'
        );
      }
    });
  });
});
