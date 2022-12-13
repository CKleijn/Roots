import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post } from '@nestjs/common';
import { Public } from '../auth/auth.module';
import { EventDto } from './event.dto';
import { EventService } from './event.service';


@Controller('events')
export class EventController {
    constructor(private readonly eventService: EventService) { }

    @Public()
    @Get()
    async getAllEvents(): Promise<Event[]> {
        Logger.log('Retrieving all events (READ)');

        return await this.eventService.getAll();
    }

    @Public()
    @Get(':id')
    async getEventById(@Param('id') eventId: string): Promise<Event> {
        try {
            Logger.log(`Retrieve event with id: ${eventId} (READ)`);

            return await this.eventService.getById(eventId);
        } catch (error) {
            if (error?.name === 'CastError')
                throw new HttpException(`This event doesn't exists!`, HttpStatus.NOT_FOUND)
        }
    }

    @Public()
    @Post()
    async createEvent(@Body() eventDto: EventDto): Promise<Object> {
        Logger.log(`Create event (POST)`);

        const event = await this.eventService.create(eventDto);

        return {
            status: 201,
            message: 'Event has been succesfully created!'
        }
    }
}
