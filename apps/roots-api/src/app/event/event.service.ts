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
    const events = await this.companyModel.find({}, { events: 1 });

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
      throw new HttpException(`This event doesn't exists!`, HttpStatus.NOT_FOUND);

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
      throw new HttpException(`This company doesn't exists!`, HttpStatus.NOT_FOUND);

    return updatedCompanyEvents;
  }

  async update(eventId: string, companyId: string, eventDto: EventDto) {
    const event = new this.eventModel(eventDto);
    const UpdatedEventFromCompany = await this.companyModel.findOneAndUpdate(
      { events: eventId},
      { $set:{"events.$":event},
      },
      {
        new:true,
        runValidators:true
      }
    );

      if (!UpdatedEventFromCompany) 
        throw new HttpException(`This event doesn't exist`, HttpStatus.NOT_FOUND);

      return UpdatedEventFromCompany;

  }
}
