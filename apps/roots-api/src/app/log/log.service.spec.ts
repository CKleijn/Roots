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

  xdescribe('getAll', () => {
    it('should retrieve all logs by organization', async () => {
      const results = await service.getAll(organizationId);
      console.log(results)
      expect(results).toBeDefined();
      expect(results[0].editor).toEqual('TestL');
      expect(results[0].action).toEqual('TestL');
      expect(results[0].object).toEqual('TestL');
      expect(results[0].logStamp).toBe(Date);
    });

    it('should throw exception when given non-existing organization', async () => {
      try {
        await service.getAll('63bc6596a420d9a3128deb5c');
      } catch (err) {
        expect(err.message).toEqual('Organisatie niet gevonden');
        expect(err.status).toEqual(404);
      }
    });
  });
  xdescribe('Create', () => {
    it('Should give error with invalid organizationId', async () => {
      const log:LogDTO = {
        editor: 'Kasper',
        action: 'Edit',
        object: 'Account',
        logStamp: new Date()
      }

      const result = await service.create(organizationId,log);
      console.log(result)
      expect(result).toBeDefined()
      expect(result.editor).toEqual(log.editor);
      expect(result.action).toEqual(log.action);
      expect(result.object).toEqual(log.object);
      expect(result.logStamp).toEqual(log.logStamp);
     
    });
  });
});
