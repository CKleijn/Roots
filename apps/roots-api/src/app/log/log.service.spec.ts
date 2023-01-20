import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Organization } from '@roots/data';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect, Model, Types } from 'mongoose';
import { OrganizationDocument, OrganizationSchema } from '../organization/organization.schema';
import { LogDTO } from './log.dto';
import { Log, LogDocument, LogSchema } from './log.schema';
import { LogService } from './log.service'


describe('OrganizationService', () => {
  let service: LogService;
  let mongod: MongoMemoryServer;
  let mongoc: MongoClient;
  let logModel: Model<LogDocument>;
  let organizationModel: Model<OrganizationDocument>;
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
          { name: Log.name, schema: LogSchema },
          { name: Organization.name, schema: OrganizationSchema },
        ]),
      ],
      providers: [LogService],
    }).compile();

    service = app.get<LogService>(LogService);
    logModel = app.get<Model<LogDocument>>(
      getModelToken(Log.name)
    );
     organizationModel = app.get<Model<OrganizationDocument>>(
        getModelToken(Organization.name)
    )

    mongoc = new MongoClient(uri);
    await mongoc.connect();
  });

  beforeEach(async () => {
    await mongoc.db('test').collection('organizations').deleteMany({});

    const logOne = new logModel({
      editor: 'TestL',
      action: 'TestL',
      object: 'TestL',
      logStamp: new Date(),
    });

    const organizationOne = new organizationModel({
      name: 'Organization1',
      emailDomain: 'organization1.com',
      logs: [logOne]
    });

    await organizationOne.save();

    organizationId = organizationOne._id;
  });

  afterAll(async () => {
    await mongoc.close();
    await disconnect();
    await mongod.stop();
  });

  describe('getAll', () => {
    it('should retrieve all logs by organization', async () => {
      const results: any = await service.getAll(organizationId);
      expect(results).toBeDefined();
      expect(results.logs[0].editor).toEqual('TestL');
      expect(results.logs[0].action).toEqual('TestL');
      expect(results.logs[0].object).toEqual('TestL');
    });

    xit('should throw exception when given non-existing organization', async () => {
      try {
        await service.getAll('63bc6596a420d9a3128deb5c');
      } catch (err) {
        expect(err.message).toEqual('Organisatie niet gevonden');
        expect(err.status).toEqual(404);
      }
    });
  });
  describe('Create', () => {
    xit('Should give error with invalid organizationId', async () => {
      const log:LogDTO = {
        editor: 'TestL',
        action: 'TestL',
        object: 'TestL',
        logStamp: new Date()
      }

      const result: any = await service.create(organizationId,log);
      expect(result).toBeDefined()
      expect(result.logs[0].editor).toEqual(log.editor);
      expect(result.logs[0].action).toEqual(log.action);
      expect(result.logs[0].object).toEqual(log.object);
    });
  });
});
