import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from '../company/company.schema';
import { EventDto } from './event.dto';
import { EventDocument } from './event.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>
  ) { }

  async getAll(): Promise<Event[]> {
    return await this.eventModel.find({});
  }

  async getById(id: string): Promise<Event> {
    const event = await this.eventModel.findOne({ _id: id });

    if (!event)
      throw new HttpException(`This event doesn't exists!`, HttpStatus.NOT_FOUND);

    return await event.toObject();
  }

  async create(companyId: string, eventDto: EventDto): Promise<any> {
    const event = new this.eventModel(eventDto);
    const updatedCompanyEvents = await this.companyModel.findOneAndUpdate
    (
      { _id: companyId },
      { $push: { events: event } },
      { new: true }
    );

    if (!updatedCompanyEvents)
      throw new HttpException(`This company doesn't exists!`, HttpStatus.NOT_FOUND);

    return updatedCompanyEvents;
  }
}
