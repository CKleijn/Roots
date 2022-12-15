import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post, Put } from '@nestjs/common';
import { Public } from '../auth/auth.module';
import { EventDto } from './event.dto';
import { Event } from './event.schema';
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
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }

    @Public()
    @Post('new/:companyId')
    async createEvent(@Param('companyId') companyId: string, @Body() eventDto: EventDto): Promise<Object> {
        try {
            Logger.log(`Create event (POST)`);

            const event = await this.eventService.create(companyId, eventDto);

            return {
                status: 201,
                message: 'Event has been successfully created!'
            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }


    @Public()
    @Put(':companyId/:eventId/edit')
    async updateEvent(@Param('companyId') companyId: string, @Param('eventId') eventId: string, @Body() eventDto: EventDto): Promise<Object> {
        try {
            Logger.log(`Update event ${eventId} from company ${companyId} (PUT)`);

            const event = await this.eventService.update(eventId, eventDto);

            return {
                status: 200,
                message: 'Event has been successfully updated!'
            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_MODIFIED)
        }
    }
}