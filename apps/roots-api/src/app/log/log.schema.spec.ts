import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { MongoMemoryServer } from "mongodb-memory-server";
import { disconnect, Model } from "mongoose";
import { Log, LogSchema } from "./log.schema";

describe('Organization schema', () => {
    let mongod: MongoMemoryServer;
    let organizationModel: Model<Log>;
  
    beforeAll(async () => {
      const app = await Test.createTestingModule({
        imports: [
          MongooseModule.forRootAsync({
            useFactory: async () => {
              mongod = await MongoMemoryServer.create();
              const uri = mongod.getUri();
              return {uri};
            },
          }),
          MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])
        ],
      }).compile();
  
      organizationModel = app.get<Model<Log>>(getModelToken(Log.name));
  
      await organizationModel.ensureIndexes();
    });
  
    afterAll(async () => {
      await disconnect();
      await mongod.stop();
    });

    // Class validator is isType
    it('editor has a incorrect type', async () => {
        const model = plainToInstance(Log, { editor: 1 })

        const err = await validate(model);

        expect(err.length).not.toBe(0);
        expect(err[0].constraints.isString).toContain(`Editor moet van het type string zijn!`);
    });

    it('action has a incorrect type', async () => {
        const model = plainToInstance(Log, { editor: 'Test', action: 1 })

        const err = await validate(model);

        expect(err.length).not.toBe(0);
        expect(err[0].constraints.isString).toContain(`Action moet van het type string zijn!`);
    });
    it('object has a incorrect type', async () => {
        const model = plainToInstance(Log, { editor: 'Test', action: 'Test', object: 1 })

        const err = await validate(model);

        expect(err.length).not.toBe(0);
        expect(err[0].constraints.isString).toContain(`Object moet van het type string zijn!`);
    });

    
    
    
});