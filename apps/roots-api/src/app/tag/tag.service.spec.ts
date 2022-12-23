import { Test, TestingModule } from '@nestjs/testing';
import mongoose, { Types } from 'mongoose';
import { OrganizationSchema } from '../organization/organization.schema';
import { Tag, TagSchema } from './tag.schema';
import { TagService } from './tag.service';
import { plainToClass } from 'class-transformer';
import { Organization } from '@roots/data';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { TagController } from './tag.controller';

const tagId = '63a1be7df54b494c2057a616'
const organizationId = '63a09e27f6aecaaf5e536719'
const tag: Tag = plainToClass(Tag, {_id:new Types.ObjectId(tagId), name:'Nestjs',organization:new Types.ObjectId(organizationId)})

const TAG_MODEL:mongoose.Model<any> = mongoose.model('Tag', TagSchema);
const ORG_MODEL:mongoose.Model<any> = mongoose.model('Organization', OrganizationSchema);

const tagModelMock = {
    // mock functions
    findOne: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
}

const organizationModelMock = {
    // mock functions
    findOne: jest.fn(),
    updateOne: jest.fn(),
}

xdescribe('Tag Service Testing', () => {
    let tagService:TagService;
    let tagModel, orgModel

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports:[
                MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
                MongooseModule.forFeature([{ name: Organization.name, schema: OrganizationSchema }]),
                
            ],
            providers: [TagService,
            {
                provide:getModelToken('TAG_MODEL'),
                useValue:tagModelMock
            },
            {
                provide:getModelToken('ORG_MODEL'),
                useValue:organizationModelMock
            }],
        }).compile();
        tagService = module.get<TagService>(TagService);
        orgModel = module.get<mongoose.Model<any>>(ORG_MODEL);
        tagModel = module.get<mongoose.Model<any>>(TAG_MODEL);
    });

    
    afterEach(() => jest.clearAllMocks());

    xdescribe('Functions being called', () => {
        it('findOne (TAG)', () => {
            expect(tagModel.findOne).toHaveBeenCalled();
        })
    })



   xdescribe('getAllByOrganization', () => {
        it('should return Promise<Tag[]>', () => {
            const findOneSpy = jest.spyOn(tagModelMock,'findOne')
        })
   })














//    ---------------------------------------------------------------------------------------------------------------------------------
   xdescribe('getById', () => {
        it('', () => {
            console.log()
        })
   })
   xdescribe('createInEvent', () => {
        it('', () => {
            console.log()
        })
   })
   xdescribe('createInOrganization', () => {
        it('', () => {
            console.log()
        })
   })
   xdescribe('update', () => {
        it('', () => {
            console.log()
        })
   })
   xdescribe('delete', () => {
        it('', () => {
            console.log()
        })
   })
})

