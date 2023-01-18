import { CanActivate } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Organization } from '@roots/data';
import { Types } from 'mongoose';
import { Public } from './../auth/auth.module';
import { User } from './../user/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('Auth controller', () => {
  let app: TestingModule;
  let userController: UserController;
  let userService: UserService;
  const fakeGuard: CanActivate = { canActivate: () => true };

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getAllParticipants: jest.fn(),
            getById: jest.fn(),
            create: jest.fn(),
            status: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(Public)
      .useValue(fakeGuard)
      .compile();

    userController = app.get<UserController>(UserController);
    userService = app.get<UserService>(UserService);
  });

  it('should call getAllParticipants on service', async () => {
    const exampleOrganization: Organization = {
      _id: new Types.ObjectId(),
      name: 'TestCompany',
      emailDomain: 'test.com',
      events: [],
      tags: [],
      logs: [],
    };

    const exampleUsers: User[] = [
      {
        _id: new Types.ObjectId(),
        firstname: 'test',
        lastname: 'tester',
        emailAddress: 'test@test.com',
        password: 'password',
        isActive: true,
        isVerified: true,
        createdAt: new Date(),
        lastLoginTimestamp: new Date(),
        organization: exampleOrganization._id,
      },
      {
        _id: new Types.ObjectId(),
        firstname: 'test2',
        lastname: 'tester2',
        emailAddress: 'test2@test.com',
        password: 'password',
        isActive: true,
        isVerified: true,
        createdAt: new Date(),
        lastLoginTimestamp: new Date(),
        organization: exampleOrganization._id,
      },
    ];

    const getParticipants = jest
      .spyOn(userService, 'getAllParticipants')
      .mockImplementation(async () => exampleUsers);

    const results = await userController.getParticipants(
      exampleOrganization._id.toString()
    );

    expect(getParticipants).toBeCalledTimes(1);
    expect(results).toHaveLength(2);

    expect(results[0]).toHaveProperty('_id', results[0]._id);
    expect(results[0]).toHaveProperty('firstname', results[0].firstname);
    expect(results[0]).toHaveProperty('lastname', results[0].lastname);
    expect(results[0]).toHaveProperty('emailAddress', results[0].emailAddress);
    expect(results[0]).toHaveProperty('isActive', results[0].isActive);
    expect(results[0]).toHaveProperty('createdAt', results[0].createdAt);
    expect(results[0]).toHaveProperty(
      'lastLoginTimestamp',
      results[0].lastLoginTimestamp
    );
    expect(results[0]).toHaveProperty('organization', results[0].organization);

    expect(results[1]).toHaveProperty('_id', results[1]._id);
    expect(results[1]).toHaveProperty('firstname', results[1].firstname);
    expect(results[1]).toHaveProperty('lastname', results[1].lastname);
    expect(results[1]).toHaveProperty('emailAddress', results[1].emailAddress);
    expect(results[1]).toHaveProperty('isActive', results[1].isActive);
    expect(results[1]).toHaveProperty('createdAt', results[1].createdAt);
    expect(results[1]).toHaveProperty(
      'lastLoginTimestamp',
      results[1].lastLoginTimestamp
    );
    expect(results[1]).toHaveProperty('organization', results[1].organization);
  });

  it('should call getById on service', async () => {
    const exampleOrganization: Organization = {
      _id: new Types.ObjectId(),
      name: 'TestCompany',
      emailDomain: 'test.com',
      events: [],
      tags: [],
      logs: [],
    };

    const exampleUser: User = {
      _id: new Types.ObjectId(),
      firstname: 'test',
      lastname: 'tester',
      emailAddress: 'test@test.com',
      password: 'password',
      isActive: true,
      isVerified: true,
      createdAt: new Date(),
      lastLoginTimestamp: new Date(),
      organization: exampleOrganization._id,
    };

    const getById = jest
      .spyOn(userService, 'getById')
      .mockImplementation(async () => exampleUser);

    const results = await userController.getById(exampleUser._id.toString());

    expect(getById).toBeCalledTimes(1);

    expect(results).toHaveProperty('_id', results._id);
    expect(results).toHaveProperty('firstname', results.firstname);
    expect(results).toHaveProperty('lastname', results.lastname);
    expect(results).toHaveProperty('emailAddress', results.emailAddress);
    expect(results).toHaveProperty('isActive', results.isActive);
    expect(results).toHaveProperty('createdAt', results.createdAt);
    expect(results).toHaveProperty(
      'lastLoginTimestamp',
      results.lastLoginTimestamp
    );
    expect(results).toHaveProperty('organization', results.organization);
  });

  it('should call create on service', async () => {
    const exampleOrganization: Organization = {
      _id: new Types.ObjectId(),
      name: 'TestCompany',
      emailDomain: 'test.com',
      events: [],
      tags: [],
      logs: [],
    };

    const exampleUser: User = {
      _id: new Types.ObjectId(),
      firstname: 'test',
      lastname: 'tester',
      emailAddress: 'test@test.com',
      password: 'password',
      isActive: true,
      isVerified: true,
      createdAt: new Date(),
      lastLoginTimestamp: new Date(),
      organization: exampleOrganization._id,
    };

    const create = jest
      .spyOn(userService, 'create')
      .mockImplementation(async () => exampleUser);

    const results = await userController.create({
      firstname: 'test',
      lastname: 'tester',
      emailAddress: 'test@test.com',
      password: 'password',
    });

    expect(create).toBeCalledTimes(1);

    expect(results).toHaveProperty('_id', results._id);
    expect(results).toHaveProperty('firstname', results.firstname);
    expect(results).toHaveProperty('lastname', results.lastname);
    expect(results).toHaveProperty('emailAddress', results.emailAddress);
    expect(results).toHaveProperty('isActive', results.isActive);
    expect(results).toHaveProperty('createdAt', results.createdAt);
    expect(results).toHaveProperty(
      'lastLoginTimestamp',
      results.lastLoginTimestamp
    );
    expect(results).toHaveProperty('organization', results.organization);
  });

  it('should call status on service', async () => {
    const exampleOrganization: Organization = {
      _id: new Types.ObjectId(),
      name: 'TestCompany',
      emailDomain: 'test.com',
      events: [],
      tags: [],
      logs: [],
    };

    const exampleUser: User = {
      _id: new Types.ObjectId(),
      firstname: 'test',
      lastname: 'tester',
      emailAddress: 'test@test.com',
      password: 'password',
      isActive: true,
      isVerified: true,
      createdAt: new Date(),
      lastLoginTimestamp: new Date(),
      organization: exampleOrganization._id,
    };

    const status = jest
      .spyOn(userService, 'status')
      .mockImplementation(async () => exampleUser);

    const results = await userController.status(exampleUser._id.toString(), {});

    expect(status).toBeCalledTimes(1);

    expect(results).toHaveProperty('_id', results._id);
    expect(results).toHaveProperty('firstname', results.firstname);
    expect(results).toHaveProperty('lastname', results.lastname);
    expect(results).toHaveProperty('emailAddress', results.emailAddress);
    expect(results).toHaveProperty('isActive', results.isActive);
    expect(results).toHaveProperty('createdAt', results.createdAt);
    expect(results).toHaveProperty(
      'lastLoginTimestamp',
      results.lastLoginTimestamp
    );
    expect(results).toHaveProperty('organization', results.organization);
  });
});
