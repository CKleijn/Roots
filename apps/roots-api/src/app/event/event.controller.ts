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
            console.log(error)
        }
    }

    @Public()
    @Post(':companyId')
    async createEvent(@Param('companyId') companyId: string, @Body() eventDto: EventDto): Promise<Object> {
        try {
            Logger.log(`Create event (POST)`);

            const event = await this.eventService.create(companyId, eventDto);

            return {
                status: 201,
                message: 'Event has been succesfully created!'
            }
        } catch (error) {
            console.log(error)
        }
    }
}
