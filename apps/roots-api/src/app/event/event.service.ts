import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Company, CompanyDocument } from '../company/company.schema';
import { EventDto } from './event.dto';
import { Event, EventDocument } from './event.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>
  ) { }

  async getAll(): Promise<Event[]> {
    const events = await this.companyModel.aggregate([
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

  async getById(id: string): Promise<Event> {
    const event = await this.companyModel.aggregate([
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

  async create(companyId: string, eventDto: EventDto): Promise<any> {
    const event = new this.eventModel(eventDto);
    const updatedCompanyEvents = await this.companyModel.findOneAndUpdate
      (
        { _id: companyId },
        { $push: { events: event } },
        {
          new: true,
          runValidators: true
        }
      );

    if (!updatedCompanyEvents)
      throw new HttpException(`Dit bedrijf bestaat niet!`, HttpStatus.NOT_FOUND);

    return updatedCompanyEvents;
  }

  async update(eventId: string, eventDto: EventDto): Promise<any> {
    const updatedEventFromCompany = await this.companyModel.findOneAndUpdate
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

    if (!updatedEventFromCompany)
      throw new HttpException(`Deze gebeurtenis bestaat niet!`, HttpStatus.NOT_FOUND);

    return updatedEventFromCompany;
  }
}
