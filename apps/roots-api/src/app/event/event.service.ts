import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Organization, OrganizationDocument } from '../organization/organization.schema';
import { EventDto } from './event.dto';
import { Event, EventDocument } from './event.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Organization.name) private organizationModel: Model<OrganizationDocument>
  ) { }

  async getAll(): Promise<Event[]> {
    const events = await this.organizationModel.aggregate([
      {
        '$project': {
          '_id': 0,
          'events': {
            '$sortArray': {
              'input': '$events',
              'sortBy': {
                'eventDate': -1
              }
            }
          }
        }
      }
    ]);

    return events[0]?.events;
  }

  async getPerPage(query: any): Promise<Event[]> {
    const events = await this.organizationModel.aggregate([
      {
        '$project': {
          '_id': 0,
          'events': {
            '$sortArray': {
              'input': '$events',
              'sortBy': {
                'eventDate': -1
              }
            }
          }
        }
      }
    ]);

    return events[0]?.events.slice(Number(query.old_records), Number(query.new_records) + Number(query.old_records));
  }

  async getById(id: string): Promise<Event> {
    const event = await this.organizationModel.aggregate([
      {
        '$unwind': {
          'path': '$events'
        }
      }, {
        '$match': {
          'events._id': new mongoose.Types.ObjectId(id)
        }
      }, {
        '$project': {
          '_id': 0,
          'events': 1
        }
      }
    ]);

    if (event.length === 0)
      throw new HttpException(`Deze gebeurtenis bestaat niet!`, HttpStatus.NOT_FOUND);

    return event[0]?.events;
  }

  async create(organizationId: string, eventDto: EventDto): Promise<any> {
    const event = new this.eventModel(eventDto);
    const updatedOrganizationEvents = await this.organizationModel.findOneAndUpdate
      (
        { _id: organizationId },
        { $push: { events: event } },
        {
          new: true,
          runValidators: true
        }
      );

    if (!updatedOrganizationEvents)
      throw new HttpException(`Dit bedrijf bestaat niet!`, HttpStatus.NOT_FOUND);

    return updatedOrganizationEvents;
  }

  async update(eventId: string, eventDto: EventDto): Promise<any> {
    const updatedEventFromOrganization = await this.organizationModel.findOneAndUpdate
      (
        { "events._id": eventId },
        {
          $set: {
            "events.$.title": eventDto?.title,
            "events.$.description": eventDto?.description,
            "events.$.content": eventDto?.content,
            "events.$.eventDate": eventDto?.eventDate,
          },
        },
        {
          new: true,
          runValidators: true
        }
      );

    if (!updatedEventFromOrganization)
      throw new HttpException(`Deze gebeurtenis bestaat niet!`, HttpStatus.NOT_FOUND);

    return updatedEventFromOrganization;
  }
}
