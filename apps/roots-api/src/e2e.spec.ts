import request = require('supertest');
import { INestApplication, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect, Types } from 'mongoose';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { AuthModule } from './app/auth/auth.module';
import { JwtAuthGuard } from './app/auth/jwt-auth.guard';
import { UserModule } from './app/user/user.module';
import { OrganizationModule } from './app/organization/organization.module';
import { EventModule } from './app/event/event.module';
import { TagModule } from './app/tag/tag.module';
import { MailerModule } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcryptjs';

let mongod: MongoMemoryServer;
let uri: string;

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        mongod = await MongoMemoryServer.create();
        uri = mongod.getUri();
        return { uri };
      },
    }),
    UserModule,
    OrganizationModule,
    EventModule,
    AuthModule,
    TagModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        auth: {
          user: 'apikey',
          pass: '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',
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService,
  ],
})
export class TestAppModule {}

describe('end-to-end tests of Roots API', () => {
  let app: INestApplication;
  let server;
  let module: TestingModule;
  let mongoc: MongoClient;

  const organizationId = '63bc6596a420d9b3128deb5c';

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    mongoc = new MongoClient(uri);
    await mongoc.connect();

    server = app.getHttpServer();
  });

  beforeEach(async () => {
    await mongoc.db('test').collection('events').deleteMany({});
    await mongoc.db('test').collection('organizations').deleteMany({});
    await mongoc.db('test').collection('tags').deleteMany({});
    await mongoc.db('test').collection('tokens').deleteMany({});
    await mongoc.db('test').collection('users').deleteMany({});

    await mongoc
      .db('test')
      .collection('organizations')
      .insertOne({
        _id: new Types.ObjectId(organizationId),
        name: 'Test organization',
        emailDomain: 'gmail.com',
      });

    await mongoc
      .db('test')
      .collection('users')
      .insertOne({
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'j.doe@gmail.com',
        password: await bcrypt.hashSync('Test12345', 10),
        isActive: true,
        isVerified: true,
        createdAt: new Date(),
        lastLoginTimestamp: new Date(),
        organization: new Types.ObjectId(organizationId),
      });
  });

  afterAll(async () => {
    await mongoc.close();
    await disconnect();
    await mongod.stop();
  });

  it('a user logs in', async () => {
    const loginCredentials = {
      username: 'j.doe@gmail.com',
      password: 'Test12345',
    };

    const login = await request(server)
      .post('/auth/login')
      .send(loginCredentials);

    expect(login.status).toBe(201);

    expect(login.body).toHaveProperty('_id');
    expect(login.body).toHaveProperty('emailAddress');
    expect(login.body).toHaveProperty('isVerified');
    expect(login.body).toHaveProperty('organization');
    expect(login.body).toHaveProperty('access_token');

    expect(login.body.emailAddress).toBe('j.doe@gmail.com');
  });

  it('a user logs in and creates a tag', async () => {
    const loginCredentials = {
      username: 'j.doe@gmail.com',
      password: 'Test12345',
    };

    const login = await request(server)
      .post('/auth/login')
      .send(loginCredentials);

    expect(login.status).toBe(201);

    expect(login.body).toHaveProperty('_id');
    expect(login.body).toHaveProperty('emailAddress');
    expect(login.body).toHaveProperty('isVerified');
    expect(login.body).toHaveProperty('organization');
    expect(login.body).toHaveProperty('access_token');

    expect(login.body.emailAddress).toBe('j.doe@gmail.com');

    const token = login.body.access_token;

    const tagObject = {
      name: 'Test tag',
    };

    const tag = await request(server)
      .post(`/tags/new/organizations/${organizationId}`)
      .send(tagObject)
      .set('Authorization', 'bearer ' + token);

    expect(tag.status).toBe(201);

    expect(tag.body).toHaveProperty('status');
    expect(tag.body).toHaveProperty('message');

    expect(tag.body.status).toBe(201);
    expect(tag.body.message).toBe('De tag is succesvol aangemaakt!');
  });

  it('a user logs in, creates a tag, gets the created tag and creates one event with it', async () => {
    const loginCredentials = {
      username: 'j.doe@gmail.com',
      password: 'Test12345',
    };

    const login = await request(server)
      .post('/auth/login')
      .send(loginCredentials);

    expect(login.status).toBe(201);

    expect(login.body).toHaveProperty('_id');
    expect(login.body).toHaveProperty('emailAddress');
    expect(login.body).toHaveProperty('isVerified');
    expect(login.body).toHaveProperty('organization');
    expect(login.body).toHaveProperty('access_token');

    expect(login.body.emailAddress).toBe('j.doe@gmail.com');

    const token = login.body.access_token;

    const tagObject = {
      name: 'Test tag',
    };

    const tag = await request(server)
      .post(`/tags/new/organizations/${organizationId}`)
      .send(tagObject)
      .set('Authorization', 'bearer ' + token);

    expect(tag.status).toBe(201);

    expect(tag.body).toHaveProperty('status');
    expect(tag.body).toHaveProperty('message');

    expect(tag.body.status).toBe(201);
    expect(tag.body.message).toBe('De tag is succesvol aangemaakt!');

    const tagResult = await request(server)
      .get(`/tags/organizations/${organizationId}`)
      .set('Authorization', 'bearer ' + token);

    expect(tagResult.status).toBe(200);

    expect(tagResult.body.length).toBe(1);

    expect(tagResult.body[0]).toHaveProperty('_id');
    expect(tagResult.body[0]).toHaveProperty('name');
    expect(tagResult.body[0]).toHaveProperty('organisation');

    expect(tagResult.body[0].name).toBe('Test tag');
    expect(tagResult.body[0].organisation).toBe(organizationId);

    const eventObject = {
      title: 'Test event',
      description: 'This is a test event',
      content: 'This is a test event',
      eventDate: new Date(),
      tags: [tagResult.body[0]._id],
      isActive: true,
    };

    const event = await request(server)
      .post(`/events/new/${organizationId}`)
      .send(eventObject)
      .set('Authorization', 'bearer ' + token);

    expect(event.status).toBe(201);

    expect(event.body).toHaveProperty('status');
    expect(event.body).toHaveProperty('message');

    expect(event.body.status).toBe(201);
    expect(event.body.message).toBe('De gebeurtenis is succesvol aangemaakt!');
  });

  it('a user logs in, creates a tag, gets the created tag, creates one event with it, gets the event, updates the event and then gets it again', async () => {
    const loginCredentials = {
      username: 'j.doe@gmail.com',
      password: 'Test12345',
    };

    const login = await request(server)
      .post('/auth/login')
      .send(loginCredentials);

    expect(login.status).toBe(201);

    expect(login.body).toHaveProperty('_id');
    expect(login.body).toHaveProperty('emailAddress');
    expect(login.body).toHaveProperty('isVerified');
    expect(login.body).toHaveProperty('organization');
    expect(login.body).toHaveProperty('access_token');

    expect(login.body.emailAddress).toBe('j.doe@gmail.com');

    const token = login.body.access_token;

    const tagObject = {
      name: 'Test tag',
    };

    const tag = await request(server)
      .post(`/tags/new/organizations/${organizationId}`)
      .send(tagObject)
      .set('Authorization', 'bearer ' + token);

    expect(tag.status).toBe(201);

    expect(tag.body).toHaveProperty('status');
    expect(tag.body).toHaveProperty('message');

    expect(tag.body.status).toBe(201);
    expect(tag.body.message).toBe('De tag is succesvol aangemaakt!');

    const tagResult = await request(server)
      .get(`/tags/organizations/${organizationId}`)
      .set('Authorization', 'bearer ' + token);

    expect(tagResult.status).toBe(200);

    expect(tagResult.body.length).toBe(1);

    expect(tagResult.body[0]).toHaveProperty('_id');
    expect(tagResult.body[0]).toHaveProperty('name');
    expect(tagResult.body[0]).toHaveProperty('organisation');

    expect(tagResult.body[0].name).toBe('Test tag');
    expect(tagResult.body[0].organisation).toBe(organizationId);

    const eventObject = {
      title: 'Test event',
      description: 'This is a test event',
      content: 'This is a test event',
      eventDate: new Date(),
      tags: [tagResult.body[0]._id],
      isActive: true,
    };

    const event = await request(server)
      .post(`/events/new/${organizationId}`)
      .send(eventObject)
      .set('Authorization', 'bearer ' + token);

    expect(event.status).toBe(201);

    expect(event.body).toHaveProperty('status');
    expect(event.body).toHaveProperty('message');

    expect(event.body.status).toBe(201);
    expect(event.body.message).toBe('De gebeurtenis is succesvol aangemaakt!');

    const eventGetResult = await request(server)
      .get(`/events/organization/${organizationId}`)
      .set('Authorization', 'bearer ' + token);

    expect(eventGetResult.status).toBe(200);

    expect(eventGetResult.body.length).toBe(1);

    expect(eventGetResult.body[0]).toHaveProperty('_id');
    expect(eventGetResult.body[0]).toHaveProperty('title');
    expect(eventGetResult.body[0]).toHaveProperty('description');
    expect(eventGetResult.body[0]).toHaveProperty('eventDate');
    expect(eventGetResult.body[0]).toHaveProperty('isActive');
    expect(eventGetResult.body[0]).toHaveProperty('tags');

    expect(eventGetResult.body[0].title).toBe('Test event');
    expect(eventGetResult.body[0].description).toBe('This is a test event');
    expect(eventGetResult.body[0].isActive).toBe(true);

    expect(eventGetResult.body[0].tags.length).toBe(1);
    expect(eventGetResult.body[0].tags[0]).toBe(tagResult.body[0]._id);

    const eventUpdateObject = {
      title: 'New event',
      description: 'This is a new event',
      content: 'This is a new event',
    };

    const eventResult = await request(server)
      .put(`/events/${organizationId}/${eventGetResult.body[0]._id}/edit`)
      .send(eventUpdateObject)
      .set('Authorization', 'bearer ' + token);

    expect(eventResult.status).toBe(200);

    expect(eventResult.body).toHaveProperty('status');
    expect(eventResult.body).toHaveProperty('message');

    expect(eventResult.body.status).toBe(200);
    expect(eventResult.body.message).toBe(
      'De gebeurtenis is succesvol aangepast!'
    );

    const eventGetUpdateResult = await request(server)
      .get(`/events/organization/${organizationId}`)
      .set('Authorization', 'bearer ' + token);

    expect(eventGetUpdateResult.status).toBe(200);

    expect(eventGetUpdateResult.body.length).toBe(1);

    expect(eventGetUpdateResult.body[0]).toHaveProperty('_id');
    expect(eventGetUpdateResult.body[0]).toHaveProperty('title');
    expect(eventGetUpdateResult.body[0]).toHaveProperty('description');
    expect(eventGetUpdateResult.body[0]).toHaveProperty('eventDate');
    expect(eventGetUpdateResult.body[0]).toHaveProperty('isActive');
    expect(eventGetUpdateResult.body[0]).toHaveProperty('tags');

    expect(eventGetUpdateResult.body[0].title).toBe('New event');
    expect(eventGetUpdateResult.body[0].description).toBe(
      'This is a new event'
    );
    expect(eventGetUpdateResult.body[0].isActive).toBe(true);

    expect(eventGetUpdateResult.body[0].tags.length).toBe(1);
    expect(eventGetUpdateResult.body[0].tags[0]).toBe(tagResult.body[0]._id);
  });

  it('a user logs in, creates a tag, gets the created tag, creates one event with it, gets the event, updates the event, gets it again and then archives it', async () => {
    const loginCredentials = {
      username: 'j.doe@gmail.com',
      password: 'Test12345',
    };

    const login = await request(server)
      .post('/auth/login')
      .send(loginCredentials);

    expect(login.status).toBe(201);

    expect(login.body).toHaveProperty('_id');
    expect(login.body).toHaveProperty('emailAddress');
    expect(login.body).toHaveProperty('isVerified');
    expect(login.body).toHaveProperty('organization');
    expect(login.body).toHaveProperty('access_token');

    expect(login.body.emailAddress).toBe('j.doe@gmail.com');

    const token = login.body.access_token;

    const tagObject = {
      name: 'Test tag',
    };

    const tag = await request(server)
      .post(`/tags/new/organizations/${organizationId}`)
      .send(tagObject)
      .set('Authorization', 'bearer ' + token);

    expect(tag.status).toBe(201);

    expect(tag.body).toHaveProperty('status');
    expect(tag.body).toHaveProperty('message');

    expect(tag.body.status).toBe(201);
    expect(tag.body.message).toBe('De tag is succesvol aangemaakt!');

    const tagResult = await request(server)
      .get(`/tags/organizations/${organizationId}`)
      .set('Authorization', 'bearer ' + token);

    expect(tagResult.status).toBe(200);

    expect(tagResult.body.length).toBe(1);

    expect(tagResult.body[0]).toHaveProperty('_id');
    expect(tagResult.body[0]).toHaveProperty('name');
    expect(tagResult.body[0]).toHaveProperty('organisation');

    expect(tagResult.body[0].name).toBe('Test tag');
    expect(tagResult.body[0].organisation).toBe(organizationId);

    const eventObject = {
      title: 'Test event',
      description: 'This is a test event',
      content: 'This is a test event',
      eventDate: new Date(),
      tags: [tagResult.body[0]._id],
      isActive: true,
    };

    const event = await request(server)
      .post(`/events/new/${organizationId}`)
      .send(eventObject)
      .set('Authorization', 'bearer ' + token);

    expect(event.status).toBe(201);

    expect(event.body).toHaveProperty('status');
    expect(event.body).toHaveProperty('message');

    expect(event.body.status).toBe(201);
    expect(event.body.message).toBe('De gebeurtenis is succesvol aangemaakt!');

    const eventGetResult = await request(server)
      .get(`/events/organization/${organizationId}`)
      .set('Authorization', 'bearer ' + token);

    expect(eventGetResult.status).toBe(200);

    expect(eventGetResult.body.length).toBe(1);

    expect(eventGetResult.body[0]).toHaveProperty('_id');
    expect(eventGetResult.body[0]).toHaveProperty('title');
    expect(eventGetResult.body[0]).toHaveProperty('description');
    expect(eventGetResult.body[0]).toHaveProperty('eventDate');
    expect(eventGetResult.body[0]).toHaveProperty('isActive');
    expect(eventGetResult.body[0]).toHaveProperty('tags');

    expect(eventGetResult.body[0].title).toBe('Test event');
    expect(eventGetResult.body[0].description).toBe('This is a test event');
    expect(eventGetResult.body[0].isActive).toBe(true);

    expect(eventGetResult.body[0].tags.length).toBe(1);
    expect(eventGetResult.body[0].tags[0]).toBe(tagResult.body[0]._id);

    const eventUpdateObject = {
      title: 'New event',
      description: 'This is a new event',
      content: 'This is a new event',
    };

    const eventResult = await request(server)
      .put(`/events/${organizationId}/${eventGetResult.body[0]._id}/edit`)
      .send(eventUpdateObject)
      .set('Authorization', 'bearer ' + token);

    expect(eventResult.status).toBe(200);

    expect(eventResult.body).toHaveProperty('status');
    expect(eventResult.body).toHaveProperty('message');

    expect(eventResult.body.status).toBe(200);
    expect(eventResult.body.message).toBe(
      'De gebeurtenis is succesvol aangepast!'
    );

    const eventGetUpdateResult = await request(server)
      .get(`/events/organization/${organizationId}`)
      .set('Authorization', 'bearer ' + token);

    expect(eventGetUpdateResult.status).toBe(200);

    expect(eventGetUpdateResult.body.length).toBe(1);

    expect(eventGetUpdateResult.body[0]).toHaveProperty('_id');
    expect(eventGetUpdateResult.body[0]).toHaveProperty('title');
    expect(eventGetUpdateResult.body[0]).toHaveProperty('description');
    expect(eventGetUpdateResult.body[0]).toHaveProperty('eventDate');
    expect(eventGetUpdateResult.body[0]).toHaveProperty('isActive');
    expect(eventGetUpdateResult.body[0]).toHaveProperty('tags');

    expect(eventGetUpdateResult.body[0].title).toBe('New event');
    expect(eventGetUpdateResult.body[0].description).toBe(
      'This is a new event'
    );
    expect(eventGetUpdateResult.body[0].isActive).toBe(true);

    expect(eventGetUpdateResult.body[0].tags.length).toBe(1);
    expect(eventGetUpdateResult.body[0].tags[0]).toBe(tagResult.body[0]._id);

    const eventArchiveResult = await request(server)
      .put(
        `/events/${organizationId}/${eventGetUpdateResult.body[0]._id}/archive?isActive=false`
      )
      .set('Authorization', 'bearer ' + token);

    expect(eventArchiveResult.status).toBe(200);

    expect(eventArchiveResult.body).toHaveProperty('_id');
    expect(eventArchiveResult.body).toHaveProperty('title');
    expect(eventArchiveResult.body).toHaveProperty('description');
    expect(eventArchiveResult.body).toHaveProperty('content');
    expect(eventArchiveResult.body).toHaveProperty('eventDate');
    expect(eventArchiveResult.body).toHaveProperty('isActive');
    expect(eventArchiveResult.body).toHaveProperty('tags');

    expect(eventArchiveResult.body.title).toBe('New event');
    expect(eventArchiveResult.body.description).toBe('This is a new event');
    expect(eventArchiveResult.body.isActive).toBe(false);

    expect(eventArchiveResult.body.tags.length).toBe(1);
    expect(eventArchiveResult.body.tags[0]).toBe(tagResult.body[0]._id);
  });

  it('a user logs in, creates a tag, gets the created tag, creates one event with it, gets the event, updates the event, gets it again, archives it, filters all the events to get all archived and non-archived events and then filters all events to get all non-archived events', async () => {
    const loginCredentials = {
      username: 'j.doe@gmail.com',
      password: 'Test12345',
    };

    const login = await request(server)
      .post('/auth/login')
      .send(loginCredentials);

    expect(login.status).toBe(201);

    expect(login.body).toHaveProperty('_id');
    expect(login.body).toHaveProperty('emailAddress');
    expect(login.body).toHaveProperty('isVerified');
    expect(login.body).toHaveProperty('organization');
    expect(login.body).toHaveProperty('access_token');

    expect(login.body.emailAddress).toBe('j.doe@gmail.com');

    const token = login.body.access_token;

    const tagObject = {
      name: 'Test tag',
    };

    const tag = await request(server)
      .post(`/tags/new/organizations/${organizationId}`)
      .send(tagObject)
      .set('Authorization', 'bearer ' + token);

    expect(tag.status).toBe(201);

    expect(tag.body).toHaveProperty('status');
    expect(tag.body).toHaveProperty('message');

    expect(tag.body.status).toBe(201);
    expect(tag.body.message).toBe('De tag is succesvol aangemaakt!');

    const tagResult = await request(server)
      .get(`/tags/organizations/${organizationId}`)
      .set('Authorization', 'bearer ' + token);

    expect(tagResult.status).toBe(200);

    expect(tagResult.body.length).toBe(1);

    expect(tagResult.body[0]).toHaveProperty('_id');
    expect(tagResult.body[0]).toHaveProperty('name');
    expect(tagResult.body[0]).toHaveProperty('organisation');

    expect(tagResult.body[0].name).toBe('Test tag');
    expect(tagResult.body[0].organisation).toBe(organizationId);

    const eventObject = {
      title: 'Test event',
      description: 'This is a test event',
      content: 'This is a test event',
      eventDate: new Date(),
      tags: [tagResult.body[0]._id],
      isActive: true,
    };

    const event = await request(server)
      .post(`/events/new/${organizationId}`)
      .send(eventObject)
      .set('Authorization', 'bearer ' + token);

    expect(event.status).toBe(201);

    expect(event.body).toHaveProperty('status');
    expect(event.body).toHaveProperty('message');

    expect(event.body.status).toBe(201);
    expect(event.body.message).toBe('De gebeurtenis is succesvol aangemaakt!');

    const eventGetResult = await request(server)
      .get(`/events/organization/${organizationId}`)
      .set('Authorization', 'bearer ' + token);

    expect(eventGetResult.status).toBe(200);

    expect(eventGetResult.body.length).toBe(1);

    expect(eventGetResult.body[0]).toHaveProperty('_id');
    expect(eventGetResult.body[0]).toHaveProperty('title');
    expect(eventGetResult.body[0]).toHaveProperty('description');
    expect(eventGetResult.body[0]).toHaveProperty('eventDate');
    expect(eventGetResult.body[0]).toHaveProperty('isActive');
    expect(eventGetResult.body[0]).toHaveProperty('tags');

    expect(eventGetResult.body[0].title).toBe('Test event');
    expect(eventGetResult.body[0].description).toBe('This is a test event');
    expect(eventGetResult.body[0].isActive).toBe(true);

    expect(eventGetResult.body[0].tags.length).toBe(1);
    expect(eventGetResult.body[0].tags[0]).toBe(tagResult.body[0]._id);

    const eventUpdateObject = {
      title: 'New event',
      description: 'This is a new event',
      content: 'This is a new event',
    };

    const eventResult = await request(server)
      .put(`/events/${organizationId}/${eventGetResult.body[0]._id}/edit`)
      .send(eventUpdateObject)
      .set('Authorization', 'bearer ' + token);

    expect(eventResult.status).toBe(200);

    expect(eventResult.body).toHaveProperty('status');
    expect(eventResult.body).toHaveProperty('message');

    expect(eventResult.body.status).toBe(200);
    expect(eventResult.body.message).toBe(
      'De gebeurtenis is succesvol aangepast!'
    );

    const eventGetUpdateResult = await request(server)
      .get(`/events/organization/${organizationId}`)
      .set('Authorization', 'bearer ' + token);

    expect(eventGetUpdateResult.status).toBe(200);

    expect(eventGetUpdateResult.body.length).toBe(1);

    expect(eventGetUpdateResult.body[0]).toHaveProperty('_id');
    expect(eventGetUpdateResult.body[0]).toHaveProperty('title');
    expect(eventGetUpdateResult.body[0]).toHaveProperty('description');
    expect(eventGetUpdateResult.body[0]).toHaveProperty('eventDate');
    expect(eventGetUpdateResult.body[0]).toHaveProperty('isActive');
    expect(eventGetUpdateResult.body[0]).toHaveProperty('tags');

    expect(eventGetUpdateResult.body[0].title).toBe('New event');
    expect(eventGetUpdateResult.body[0].description).toBe(
      'This is a new event'
    );
    expect(eventGetUpdateResult.body[0].isActive).toBe(true);

    expect(eventGetUpdateResult.body[0].tags.length).toBe(1);
    expect(eventGetUpdateResult.body[0].tags[0]).toBe(tagResult.body[0]._id);

    const eventArchiveResult = await request(server)
      .put(
        `/events/${organizationId}/${eventGetUpdateResult.body[0]._id}/archive?isActive=false`
      )
      .set('Authorization', 'bearer ' + token);

    expect(eventArchiveResult.status).toBe(200);

    expect(eventArchiveResult.body).toHaveProperty('_id');
    expect(eventArchiveResult.body).toHaveProperty('title');
    expect(eventArchiveResult.body).toHaveProperty('description');
    expect(eventArchiveResult.body).toHaveProperty('content');
    expect(eventArchiveResult.body).toHaveProperty('eventDate');
    expect(eventArchiveResult.body).toHaveProperty('isActive');
    expect(eventArchiveResult.body).toHaveProperty('tags');

    expect(eventArchiveResult.body.title).toBe('New event');
    expect(eventArchiveResult.body.description).toBe('This is a new event');
    expect(eventArchiveResult.body.isActive).toBe(false);

    expect(eventArchiveResult.body.tags.length).toBe(1);
    expect(eventArchiveResult.body.tags[0]).toBe(tagResult.body[0]._id);

    const eventGetFilterResult = await request(server)
      .get(
        `/events/${organizationId}/filter?old_records=0&new_records=5&show_archived_events=true`
      )
      .set('Authorization', 'bearer ' + token);

    expect(eventGetFilterResult.status).toBe(200);

    expect(eventGetFilterResult.body.length).toBe(1);

    expect(eventGetFilterResult.body[0]).toHaveProperty('_id');
    expect(eventGetFilterResult.body[0]).toHaveProperty('title');
    expect(eventGetFilterResult.body[0]).toHaveProperty('description');
    expect(eventGetFilterResult.body[0]).toHaveProperty('eventDate');
    expect(eventGetFilterResult.body[0]).toHaveProperty('isActive');
    expect(eventGetFilterResult.body[0]).toHaveProperty('tags');

    expect(eventGetFilterResult.body[0].title).toBe('New event');
    expect(eventGetFilterResult.body[0].description).toBe(
      'This is a new event'
    );
    expect(eventGetFilterResult.body[0].isActive).toBe(false);

    expect(eventGetFilterResult.body[0].tags.length).toBe(1);
    expect(eventGetFilterResult.body[0].tags[0]).toBe(tagResult.body[0]._id);

    const eventGetFilterSecondResult = await request(server)
      .get(
        `/events/${organizationId}/filter?old_records=0&new_records=5&show_archived_events=false`
      )
      .set('Authorization', 'bearer ' + token);

    expect(eventGetFilterSecondResult.status).toBe(200);

    expect(eventGetFilterSecondResult.body.length).toBe(0);
  });
});
