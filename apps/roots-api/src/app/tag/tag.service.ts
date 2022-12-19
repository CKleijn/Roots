import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Tag, TagDocument } from "./tag.schema";
import { Organization, OrganizationDocument } from '../organization/organization.schema'
import { TagDto } from "./tag.dto";

@Injectable()
export class TagService {

    constructor(
        @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
        @InjectModel(Organization.name) private organizationModel: Model<OrganizationDocument>
    ) { }

    async getAllByOrganization(organizationId: string): Promise<Tag[]> {
        // eslint-disable-next-line prefer-const
        let tags = [];
        const organizationTagIds = await this.organizationModel.findOne({ _id: new Types.ObjectId(organizationId)},{tags:1});
        organizationTagIds.tags.forEach(async tagId => {
            const tag = (await this.tagModel.findOne({ _id: new Types.ObjectId(tagId) }));
            const test = {
                name: tag.name,
                organisation: tag.organisation
            }

            console.log(test)

            tags.push(test);
        });

        return tags;
    }

    async getById(tagId: string): Promise<Tag> {
        const tag = await this.tagModel.findOne({_id: new Types.ObjectId(tagId)})
        
        if (!tag) throw new HttpException('Tag niet gevonden', HttpStatus.NOT_FOUND);
        
        return tag;
    }

    async create(organizationId: string, eventId: string, tagDto: TagDto): Promise<Tag> {
        // new tag
        const newTag = new this.tagModel({
            ...tagDto,
            organisation: new Types.ObjectId(organizationId)
        });

        // create new tag in collection
        const tag = await this.tagModel.create(newTag);
        if (!tag) throw new HttpException('Could not create Tag', HttpStatus.BAD_REQUEST);

        // push to organization
        const updateOrganization = await this.organizationModel.findOneAndUpdate(
                {_id:organizationId},
                {
                    $push: { tags: new Types.ObjectId(tag._id)}
                },
                {
                    new: true,
                }
        );
        
        if (!updateOrganization) throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
        
        // push to event
        const updateEvent = await this.organizationModel.findOneAndUpdate({ _id: new Types.ObjectId(organizationId), "events._id": new Types.ObjectId(eventId) }, { $push: { "events.$.tags": new Types.ObjectId(tag._id) }  } , {new:true});
        
        if (!updateEvent) throw new HttpException('Event not found', HttpStatus.NOT_FOUND);

        return tag;
    }
    
    async update(tagId: string, tagDto: TagDto): Promise<Tag> {
        const updatedTag = await this.tagModel.findOneAndUpdate(
            { _id: new Types.ObjectId(tagId) },
            { 
                $set: {
                    "name": tagDto?.name
                } 
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedTag) {
            throw new HttpException('Deze tag bestaat niet!', HttpStatus.NOT_FOUND);
        }

        return updatedTag;
    }
}
