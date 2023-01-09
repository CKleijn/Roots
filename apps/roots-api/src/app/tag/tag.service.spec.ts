import { Test } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect, Model, Types } from 'mongoose';
import { MongoClient } from 'mongodb';
import { Tag, TagDocument, TagSchema } from './tag.schema';
import { TagService } from './tag.service';
import { Organization, OrganizationDocument, OrganizationSchema } from '../organization/organization.schema';
import { TagDto } from './tag.dto';
import { HttpException } from '@nestjs/common';

describe('OrganizationService', () => {
    let service: TagService;
    let mongod: MongoMemoryServer;
    let mongoc: MongoClient;
    let tagModel: Model<TagDocument>;
    let organizationModel: Model<OrganizationDocument>;
    
    const organizationIdOne = '63bc6596a420d9b3128deb5c';
    const organizationIdTwo = '63bc6596a420d9b3128deb5d';
    const eventIdOne = '63bc6596a420d9b3128deb5a';
    const eventIdTwo = '63bc6596a420d9b3128deb5f';
    let tagOneId;
    let tagTwoId;
    let tagThreeId;
    let tagFourId;

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
                MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
                MongooseModule.forRootAsync({
                    useFactory: async () => {
                        mongod = await MongoMemoryServer.create();
                        uri = mongod.getUri();
                        return { uri };
                    },
                }),
                MongooseModule.forFeature([{ name: Organization.name, schema: OrganizationSchema }])
            ],
            providers: [TagService],
        }).compile();

        service = app.get<TagService>(TagService);
        tagModel = app.get<Model<TagDocument>>(getModelToken(Tag.name));
        organizationModel = app.get<Model<OrganizationDocument>>(getModelToken(Organization.name));

        mongoc = new MongoClient(uri);
        await mongoc.connect();
    });

    beforeEach(async () => {
        await mongoc.db('test').collection('tags').deleteMany({});
        await mongoc.db('test').collection('organizations').deleteMany({});

        const tagOne = new tagModel({
            name: 'Tag1',
            organization: new Types.ObjectId(organizationIdOne)
        });

        const tagTwo = new tagModel({
            name: 'Tag2',
            organization: new Types.ObjectId(organizationIdOne)
        });

        const tagThree = new tagModel({
            name: 'Tag3',
            organization: new Types.ObjectId(organizationIdTwo)
        });

        const tagFour = new tagModel({
            name: 'Tag4',
            organization: new Types.ObjectId(organizationIdTwo)
        });

        tagOneId = (await tagOne.save())._id;
        tagTwoId = (await tagTwo.save())._id;
        tagThreeId = (await tagThree.save())._id;
        tagFourId = (await tagFour.save())._id;

        const organizationOne = new organizationModel({
            _id: new Types.ObjectId(organizationIdOne),
            name: 'organizationOne',
            emailDomain: 'orgOne',
            tags: [
                tagOneId,
                tagTwoId
            ],
            events: [
                {
                    _id: new Types.ObjectId(eventIdOne),
                    title: 'TestEventOne',
                    description: 'This is a test event.',
                    content: 'This is a test event.',
                    eventDate: new Date(),
                    tags: [
                        tagOneId
                    ]  
                }
            ]
        })

        const organizationTwo = new organizationModel({
            _id: new Types.ObjectId(organizationIdTwo),
            name: 'organizationTwo',
            emailDomain: 'orgTwo',
            tags: [
                tagThreeId,
                tagFourId
            ],
            events: [
                {
                    _id: new Types.ObjectId(eventIdTwo),
                    title: 'TestEventTwo',
                    description: 'This is a test event.',
                    content: 'This is a test event.',
                    eventDate: new Date(),
                    tags: [
                        tagThreeId
                    ]
                }
            ]
        })

        await organizationOne.save();
        await organizationTwo.save();
    });

    afterAll(async () => {
        await mongoc.close();
        await disconnect();
        await mongod.stop();
    });

    describe('getAllByOrganization', () => {
        it('should retrieve all tags by organization', async () => {
            const results = await service.getAllByOrganization(organizationIdOne);

            expect(results).toHaveLength(2);
            expect((results[0] as any)._id).toEqual(tagOneId);
            expect((results[1] as any)._id).toEqual(tagTwoId);
            expect(results[0].name).toEqual('Tag1');
            expect(results[1].name).toEqual('Tag2');
            expect((results[0] as any).organisation).toEqual(new Types.ObjectId(organizationIdOne));
            expect((results[1] as any).organisation).toEqual(new Types.ObjectId(organizationIdOne));
        });
    });

    describe('getById', () => {
        it('should retrieve a tag by id', async () => {
            const result = await service.getById(tagOneId);

            expect(result).toBeInstanceOf(Object);
            expect((result as any)._id).toEqual(tagOneId);
            expect(result.name).toEqual('Tag1');
            expect(result.organization).toEqual(new Types.ObjectId(organizationIdOne));
        });
    });

    describe('createInEvent', () => {
        it('should create a tag in event', async () => {
            const tag = new TagDto();
            tag.name = 'test';

            const result = await service.createInEvent(organizationIdOne, eventIdOne, tag);

            expect(result).toBeInstanceOf(Object);
            expect(result.name).toEqual('test');
            expect(result.organization).toEqual(new Types.ObjectId(organizationIdOne));
        });
    });

    describe('createInOrganization', () => {
        it('should create a tag in organization', async () => {
            const tag = new TagDto();
            tag.name = 'test';
            
            const result = await service.createInOrganization(organizationIdOne, tag);

            expect(result).toBeInstanceOf(Object);
            expect(result.name).toEqual('test');
            expect(result.organization).toEqual(new Types.ObjectId(organizationIdOne));
        });
    });

    describe('update', () => {
        it('should update a tag', async () => {
            const tag = new TagDto();
            tag.name = 'test';
            
            const result = await service.update(tagFourId, tag);

            expect(result).toBeInstanceOf(Object);
            expect((result as any)._id).toEqual(new Types.ObjectId(tagFourId));
            expect(result.name).toEqual('test');
            expect(result.organization).toEqual(new Types.ObjectId(organizationIdTwo));
        });
    });

    describe('delete', () => {
        it('should delete a tag', async () => {
            try {
                await service.delete(tagTwoId, organizationIdOne);
                await service.getById(tagTwoId);
            } catch (err) {
                expect(err.message).toEqual('Tag niet gevonden');
                expect(err.status).toEqual(404);
            }
        });
    });
});