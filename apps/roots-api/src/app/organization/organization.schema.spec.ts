import { Test } from '@nestjs/testing';
import { Model, disconnect, Types } from 'mongoose';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Organization, OrganizationSchema } from './organization.schema';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

describe('Organization schema', () => {
  let mongod: MongoMemoryServer;
  let organizationModel: Model<Organization>;

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
        MongooseModule.forFeature([{ name: Organization.name, schema: OrganizationSchema }])
      ],
    }).compile();

    organizationModel = app.get<Model<Organization>>(getModelToken(Organization.name));

    await organizationModel.ensureIndexes();
  });

  afterAll(async () => {
    await disconnect();
    await mongod.stop();
  });

  // Class validator is required
  it('has a required name', async () => {
    const model = plainToInstance(Organization, {})

    const err = await validate(model);

    expect(err.length).not.toBe(0);
    expect(err[0].constraints.isDefined).toContain(`Naam is verplicht!`);
  });

  it('has a required emailDomain', async () => {
    const model = plainToInstance(Organization, { name: 'Test' })

    const err = await validate(model);

    expect(err.length).not.toBe(0);
    expect(err[0].constraints.isDefined).toContain(`Email domein is verplicht!`);
  });

  // Class validator is isType
  it('name has a incorrect type', async () => {
    const model = plainToInstance(Organization, { name: 1 })

    const err = await validate(model);

    expect(err.length).not.toBe(0);
    expect(err[0].constraints.isString).toContain(`Naam moet van het type string zijn!`);
  });

  it('emailDomain has a incorrect type', async () => {
    const model = plainToInstance(Organization, { name: 'Test', emailDomain: 1 })

    const err = await validate(model);

    expect(err.length).not.toBe(0);
    expect(err[0].constraints.isString).toContain(`Email domein moet van het type string zijn!`);
  });

  // Mongoose default values
  it('has a default events array', () => {
    const model = new organizationModel();

    const err = model.validateSync();

    expect(model.events).toStrictEqual([]);
  });

  it('has a default tags array', () => {
    const model = new organizationModel();

    const err = model.validateSync();

    expect(model.tags).toStrictEqual([]);
  });

  // Mongoose types
  it('events has a Event as type', () => {
    const model = new organizationModel();

    const err = model.validateSync();

    expect(Array.isArray(model.events)).toBe(true);
    expect(model.events.every(x => x instanceof Event)).toBe(true);
  });

  it('tags has a ObjectId as type', () => {
    const model = new organizationModel();

    const err = model.validateSync();

    expect(Array.isArray(model.tags)).toBe(true);
    expect(model.tags.every(x => x instanceof Types.ObjectId)).toBe(true);
  });
});