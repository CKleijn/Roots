import { CanActivate } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Organization } from '@roots/data';
import { Types } from 'mongoose';
import { Public } from './../auth/auth.module';
import { User } from './../user/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('Auth controller', () => {
  let app: TestingModule;
  let authController: AuthController;
  let authService: AuthService;
  const fakeGuard: CanActivate = { canActivate: () => true };

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(Public)
      .useValue(fakeGuard)
      .compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
  });

  it('should return correct login response', async () => {
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

    const loginResponse: any = {
      _id: exampleUser._id,
      firstname: exampleUser.firstname,
      lastname: exampleUser.lastname,
      emailAddress: exampleUser.emailAddress,
      organization: exampleOrganization._id,
      access_token: 'token',
    };

    const login = jest
      .spyOn(authService, 'login')
      .mockImplementation(async () => loginResponse);

    const results = await authController.login({
      body: {
        username: 'test@test.com',
        password: 'password',
      },
    });

    expect(login).toBeCalledTimes(1);
    expect(results).toHaveProperty('_id', loginResponse._id);
    expect(results).toHaveProperty('firstname', loginResponse.firstname);
    expect(results).toHaveProperty('lastname', loginResponse.lastname);
    expect(results).toHaveProperty('emailAddress', loginResponse.emailAddress);
    expect(results).toHaveProperty('organization', loginResponse.organization);
    expect(results).toHaveProperty('access_token', loginResponse.access_token);
  });

  it('should return correct registration response', async () => {
    const exampleOrganization: Organization = {
      _id: new Types.ObjectId(),
      name: 'TestCompany',
      emailDomain: 'test.com',
      events: [],
      tags: [],
      logs: [],
    };

    const userInput: any = {
      firstname: 'test',
      lastname: 'tester',
      emailAddress: 'test@test.com',
      password: 'password',
    };

    const registrationResponse: any = {
      _id: new Types.ObjectId(),
      firstname: userInput.firstname,
      lastname: userInput.lastname,
      emailAddress: userInput.emailAddress,
      organization: exampleOrganization._id,
      access_token: 'token',
    };

    const login = jest
      .spyOn(authService, 'register')
      .mockImplementation(async () => registrationResponse);

    const results = await authController.register(userInput);

    expect(login).toBeCalledTimes(1);
    expect(results).toHaveProperty('_id', registrationResponse._id);
    expect(results).toHaveProperty('firstname', registrationResponse.firstname);
    expect(results).toHaveProperty('lastname', registrationResponse.lastname);
    expect(results).toHaveProperty(
      'emailAddress',
      registrationResponse.emailAddress
    );
    expect(results).toHaveProperty(
      'organization',
      registrationResponse.organization
    );
    expect(results).toHaveProperty(
      'access_token',
      registrationResponse.access_token
    );
  });
});
