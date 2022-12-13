import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDto } from './event.dto';
import { EventDocument } from './event.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>
  ) { }

  async getAll(): Promise<Event[]> {
    return await this.eventModel.find({});
  }

  async getById(_id: string): Promise<Event> {
    const event = await this.eventModel.findOne({ _id });

    if (!event)
      throw new HttpException(`This event doesn't exists!`, HttpStatus.NOT_FOUND);

    return await event.toObject();
  }

  async create(eventDto: EventDto): Promise<Object> {
    return await this.eventModel.create(eventDto);
  }
}
