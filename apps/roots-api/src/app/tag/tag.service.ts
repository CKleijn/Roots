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
        const organizationTagIds = (await this.organizationModel.findOne({ _id: new Types.ObjectId(organizationId)},{tags:1}));
        if (!organizationTagIds) throw new HttpException('Organisatie niet gevonden', HttpStatus.NOT_FOUND);
        
        // eslint-disable-next-line prefer-const
        let tags = [];
        for await (const tagId of organizationTagIds.tags) {
            const tag = (await this.tagModel.findOne({ _id: new Types.ObjectId(tagId) }));

            tags.push({
                _id: tag._id,
                name: tag.name,
                organisation: tag.organization
            });
        }

        return tags;
    }

    async getById(tagId: string): Promise<Tag> {
        const tag = await this.tagModel.findOne({_id: new Types.ObjectId(tagId)})

        if (!tag) throw new HttpException('Tag niet gevonden', HttpStatus.NOT_FOUND);
        
        return tag;
    }

    async createInEvent(organizationId: string, eventId: string, tagDto: TagDto): Promise<Tag> {
        // validation
        const organization = await this.organizationModel.findOne({ _id: new Types.ObjectId(organizationId) });
        if (!organization) throw new HttpException('Organisatie niet gevonden', HttpStatus.NOT_FOUND);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const event = (await organization).events.filter(p => new Types.ObjectId((p as any)._id).equals(new Types.ObjectId(eventId))).at(0);
        if (!event) throw new HttpException(`Event niet gevonden van organisatie met id: ${organizationId}`, HttpStatus.NOT_FOUND);

        // new tag
        const newTag = new this.tagModel({
            ...tagDto,
            organization: new Types.ObjectId(organizationId)
        });

        // create new tag in collection
        const tag = await this.tagModel.create(newTag);
        if (!tag) throw new HttpException('Kan geen nieuwe tag aanmaken', HttpStatus.BAD_REQUEST);

        // push to organization
        await this.organizationModel.updateOne(
                {_id: new Types.ObjectId(organizationId)},
                {
                    $push: { tags: new Types.ObjectId(tag._id)}
                },
                {
                    new: true,
                }
        );

        // push to event
        await this.organizationModel.updateOne({ _id: new Types.ObjectId(organizationId), "events._id": new Types.ObjectId(eventId) }, { $push: { "events.$.tags": new Types.ObjectId(tag._id) }  } , {new:true});

        return tag;
    }
    
    async createInOrganization(organizationId: string, tagDto: TagDto): Promise<Tag> {
        // validation
        const organization = this.organizationModel.findOne({ _id: new Types.ObjectId(organizationId) });
        if (!organization) throw new HttpException('Organisatie niet gevonden', HttpStatus.NOT_FOUND);

        // new tag
        const newTag = new this.tagModel({
            ...tagDto,
            organization: new Types.ObjectId(organizationId)
        });

        // create new tag in collection
        const tag = await this.tagModel.create(newTag);
        if (!tag) throw new HttpException('Kan geen nieuwe tag aanmaken', HttpStatus.BAD_REQUEST);

        // push to organization
        await this.organizationModel.updateOne(
                {_id: new Types.ObjectId(organizationId)},
                {
                    $push: { tags: new Types.ObjectId(tag._id)}
                },
                {
                    new: true,
                }
        );

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
            throw new HttpException('Deze tag bestaat niet', HttpStatus.NOT_FOUND);
        }

        return updatedTag;
    }

    async delete(tagId:string, organizationId:string) {
        console.log(tagId)
        console.log(organizationId)
        const updatedOrganization = await this.organizationModel.findOneAndUpdate(
            {
                _id: new Types.ObjectId(organizationId)
            },
            {
                $pull: { "tags": new Types.ObjectId(tagId), "events.$[].tags": new Types.ObjectId(tagId)}
            },
            {
                new: true
            }
        );
        
        if (!updatedOrganization) {
            throw new HttpException('Deze organisatie is niet gevonden', HttpStatus.NOT_FOUND);
        } else {
            const updateTags = await this.tagModel.deleteOne({_id:tagId});
            
            if (!updateTags) {
                throw new HttpException('Tag niet gevonden', HttpStatus.NOT_FOUND)
            }
        }
    }
}