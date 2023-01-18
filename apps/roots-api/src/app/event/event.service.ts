import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import {
  Organization,
  OrganizationDocument,
} from '../organization/organization.schema';
import { EventDto } from './event.dto';
import { Event, EventDocument } from './event.schema';

@Injectable()
export class EventService {
  // Inject all dependencies
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>
  ) {}

  // Get all events
  async getAll(organizationId: string): Promise<Event[]> {
    const events = await this.organizationModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(organizationId),
        },
      },
      {
        $unwind: {
          path: '$events',
        },
      },
      {
        $lookup: {
          from: 'events',
          localField: 'events',
          foreignField: '_id',
          as: 'events',
        },
      },
      {
        $sort: {
          'events.eventDate': -1,
        },
      },
      {
        $group: {
          _id: null,
          events: {
            $push: {
              _id: {
                $first: '$events._id',
              },
              title: {
                $first: '$events.title',
              },
              description: {
                $first: '$events.description',
              },
              eventDate: {
                $first: '$events.eventDate',
              },
              isActive: {
                $first: '$events.isActive',
              },
              tags: {
                $first: '$events.tags',
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          events: 1,
        },
      },
    ]);

    return events[0]?.events;
  }

  // Get amount of events per page + filter
  async getPerPage(query: any, organizationId: string): Promise<Event[]> {
    const events = await this.organizationModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(organizationId),
        },
      },
      {
        $unwind: {
          path: '$events',
        },
      },
      {
        $lookup: {
          from: 'events',
          localField: 'events',
          foreignField: '_id',
          as: 'events',
        },
      },
      {
        $sort: {
          'events.eventDate': -1,
        },
      },
      {
        $group: {
          _id: null,
          events: {
            $push: {
              _id: {
                $first: '$events._id',
              },
              title: {
                $first: '$events.title',
              },
              description: {
                $first: '$events.description',
              },
              eventDate: {
                $first: '$events.eventDate',
              },
              isActive: {
                $first: '$events.isActive',
              },
              tags: {
                $first: '$events.tags',
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          events: 1,
        },
      },
    ]);

    if (
      query.old_records &&
      query.new_records &&
      query.show_archived_events === 'true'
    ) {
      return events[0]?.events.slice(
        Number(query.old_records),
        Number(query.new_records) + Number(query.old_records)
      );
    } else if (
      query.old_records &&
      query.new_records &&
      query.show_archived_events === 'false'
    ) {
      const activeEvents: any[] = [];
      events[0]?.events?.forEach((event) => {
        if (event.isActive) {
          activeEvents.push(event);
        }
      });
      return activeEvents.slice(
        Number(query.old_records),
        Number(query.new_records) + Number(query.old_records)
      );
    } else if (query.term && query.show_archived_events === 'true') {
      const matchingEvents: any[] = [];
      events[0]?.events?.forEach((event) => {
        if (event.title.includes(query.term)) {
          matchingEvents.push(event);
        }
      });
      return matchingEvents;
    } else if (query.term && query.show_archived_events === 'false') {
      const matchingEvents: any[] = [];
      events[0]?.events?.forEach((event) => {
        if (event.title.includes(query.term) && event.isActive) {
          matchingEvents.push(event);
        }
      });
      return matchingEvents;
    }
  }

  // Get event by ID
  async getById(id: string): Promise<Event> {
    const event = await this.organizationModel.aggregate([
      {
        $unwind: {
          path: '$events',
        },
      },
      {
        $lookup: {
          from: 'events',
          localField: 'events',
          foreignField: '_id',
          as: 'events',
        },
      },
      {
        $match: {
          'events._id': new mongoose.Types.ObjectId(id),
        },
      },
      {
        $project: {
          _id: 0,
          events: 1,
        },
      },
    ]);

    if (event.length === 0)
      throw new HttpException(
        `Deze gebeurtenis bestaat niet!`,
        HttpStatus.NOT_FOUND
      );
    return event[0]?.events[0];
  }

  // Create new organization
  async create(organizationId: string, eventDto: EventDto): Promise<any> {
    const event = await this.eventModel.create(eventDto);

    const updatedOrganizationEvents =
      await this.organizationModel.findOneAndUpdate(
        { _id: organizationId },
        { $push: { events: event._id } },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedOrganizationEvents)
      throw new HttpException(
        `Dit bedrijf bestaat niet!`,
        HttpStatus.NOT_FOUND
      );

    return updatedOrganizationEvents;
  }

  // Update organization
  async update(eventId: string, eventDto: EventDto): Promise<any> {
    const updatedEventFromOrganization = await this.eventModel.findOneAndUpdate(
      { _id: eventId },
      {
        $set: {
          title: eventDto?.title,
          description: eventDto?.description,
          content: eventDto?.content,
          tags: eventDto?.tags,
          eventDate: eventDto?.eventDate,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedEventFromOrganization)
      throw new HttpException(
        `Deze gebeurtenis bestaat niet!`,
        HttpStatus.NOT_FOUND
      );

    return updatedEventFromOrganization;
  }

  // Archive/Dearchive event
  async archive(eventId: string, isActive: boolean): Promise<any> {
    const updatedArchive = await this.eventModel.findOneAndUpdate(
      { _id: new Types.ObjectId(eventId) },
      {
        $set: {
          isActive: isActive,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedArchive)
      throw new HttpException(
        `Deze gebeurtenis bestaat niet!`,
        HttpStatus.NOT_FOUND
      );

    return await this.getById(eventId);
  }
}
