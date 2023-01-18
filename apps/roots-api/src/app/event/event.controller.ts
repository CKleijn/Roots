import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Public } from '../auth/auth.module';
import { EventDto } from './event.dto';
import { Event } from './event.schema';
import { EventService } from './event.service';

@Controller('events')
export class EventController {
  // Inject all dependencies
  constructor(private readonly eventService: EventService) {}

  // Get all events
  @Public()
  @Get('/organization/:id')
  async getAllEvents(@Param('id') organizationId: string): Promise<Event[]> {
    Logger.log('Retrieving all events (READ)');

    return await this.eventService.getAll(organizationId);
  }

  // Get an amount of events to show on page
  @Public()
  @Get(':id/filter')
  async getEventsPerPage(
    @Param('id') organizationId: string,
    @Query() query
  ): Promise<Event[]> {
    Logger.log('Retrieving events with filter (READ)');
    return await this.eventService.getPerPage(query, organizationId);
  }

  // Get event by ID
  @Public()
  @Get(':id')
  async getEventById(@Param('id') eventId: string): Promise<Event> {
    try {
      Logger.log(`Retrieve event with id: ${eventId} (READ)`);

      return await this.eventService.getById(eventId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // Create new event
  @Public()
  @Post('new/:companyId')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async createEvent(
    @Param('companyId') companyId: string,
    @Body() eventDto: EventDto
  ): Promise<Object> {
    try {
      Logger.log(`Create event (POST)`);

      const event = await this.eventService.create(companyId, eventDto);

      return {
        status: 201,
        message: 'De gebeurtenis is succesvol aangemaakt!',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // Update event
  @Public()
  @Put(':companyId/:eventId/edit')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async updateEvent(
    @Param('companyId') companyId: string,
    @Param('eventId') eventId: string,
    @Body() eventDto: EventDto
  ): Promise<Object> {
    try {
      Logger.log(`Update event ${eventId} from company ${companyId} (PUT)`);

      const event = await this.eventService.update(eventId, eventDto);

      return {
        status: 200,
        message: 'De gebeurtenis is succesvol aangepast!',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_MODIFIED);
    }
  }

  // Archive/Dearchive event
  @Public()
  @Put(':companyId/:eventId/archive')
  async archiveEvent(
    @Param('companyId') companyId: string,
    @Param('eventId') eventId: string,
    @Query('isActive') isActive: boolean
  ): Promise<Event> {
    try {
      Logger.log(
        isActive
          ? 'Archiveren'
          : 'Dearchiveren' + ` event  from ${eventId} from company ${companyId}`
      );

      return await this.eventService.archive(eventId, isActive);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_MODIFIED);
    }
  }
}
