import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from "./tag.service";
import { TagController } from "./tag.controller";
import { Tag } from './tag.schema';
import { CanActivate } from '@nestjs/common';
import { Public } from '../auth/auth.module';
import { Types } from 'mongoose';

describe('Tag controller - Integration tests', () => {
    let app: TestingModule;
    let tagController: TagController;
    let tagService: TagService;
    const fakeGuard: CanActivate = { canActivate: () => true };

    const organizationId = new Types.ObjectId();
    const eventId = new Types.ObjectId();
    const tagId = new Types.ObjectId();

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [TagController],
            providers: [{
                provide: TagService,
                useValue: {
                    getAllByOrganization: jest.fn(),
                    getById: jest.fn(),
                    createInEvent: jest.fn(),
                    createInOrganization: jest.fn(),
                    update: jest.fn(),
                },
            }],
        })
        .overrideGuard(Public).useValue(fakeGuard)
        .compile();

        tagController = app.get<TagController>(TagController);
        tagService = app.get<TagService>(TagService);
    });

    it('schould call getAllByOrganization on service', async () => {
        const exampleTags: Tag[] = [{
                    name:'Tag1',
                    organization:organizationId
                },
                {
                    name:'Tag2',
                    organization: organizationId
                },
            ];

            const getTags = jest.spyOn(tagService, 'getAllByOrganization')
            .mockImplementation(async () => exampleTags);

            const results = await tagController.getAllTagsByOrganization(organizationId.toString());

            expect(getTags).toBeCalledTimes(1);
            expect(results).toHaveLength(2);

            expect(results[0]).toHaveProperty('name', exampleTags[0].name);
            expect(results[0]).toHaveProperty('organization', exampleTags[0].organization);
            expect(results[1]).toHaveProperty('name', exampleTags[1].name);
            expect(results[1]).toHaveProperty('organization', exampleTags[1].organization);
    });

    it('should call getById on service', async () => {
        const exampleTag: Tag = {
            name:'Tag',
            organization:organizationId
        }

        const getTag = jest.spyOn(tagService, 'getById')
            .mockImplementation(async () => exampleTag);

        const result: any = await tagController.getTagById(tagId.toString())    

        expect(getTag).toBeCalledTimes(1);
        expect(result.name).toEqual(exampleTag.name);
        expect(result.organization).toEqual(exampleTag.organization);
    })

    it('should call createInEvent on service',async () => {
        const exampleTag: Tag = {
            name:'Tag',
            organization:organizationId
        }

        const createTag = jest.spyOn(tagService, 'createInEvent')
            .mockImplementation(async () => exampleTag);

        const result: any = await tagController.createTagInEvent(organizationId.toString(),eventId.toString(),exampleTag)

        expect(createTag).toBeCalledTimes(1);
        expect(result.message).toEqual('De tag is succesvol aangemaakt!');
        expect(result.status).toEqual(201);
    })

    it('should call createInOrganization on service', async () => {
        const exampleTag: Tag = {
            name:'Tag',
            organization:new Types.ObjectId()
        }

        const createTag = jest.spyOn(tagService, 'createInOrganization')
            .mockImplementation(async()=> exampleTag);

        const result: any = await tagController.createTagInOrganization(organizationId.toString(),exampleTag);

        expect(createTag).toBeCalledTimes(1);
        expect(result.message).toEqual('De tag is succesvol aangemaakt!');
        expect(result.status).toEqual(201);
    })

    it('should call update on service', async () => {
        const exampleTag: Tag = {
            name:'Tag',
            organization:new Types.ObjectId()
        }

        const updateTag = jest.spyOn(tagService, 'update')
            .mockImplementation(async () => exampleTag);

        const result: any = await tagController.updateTag(organizationId.toString(), exampleTag);

        expect(updateTag).toBeCalledTimes(1);
        expect(result.message).toEqual('De tag is succesvol aangepast!');
        expect(result.status).toEqual(200);
    })
});