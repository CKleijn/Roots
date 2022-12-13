import { IEvent } from '@roots/data';
import { IsDefined, IsString, IsISO8601 } from 'class-validator';

export class EventDto implements IEvent {
    @IsString({ message: 'Title must be a string!' })
    @IsDefined({ message: 'Title is required!' })
    title: string;
    
    @IsString({ message: 'Description must be a string!' })
    @IsDefined({ message: 'Description is required!' })
    description: string;

    @IsString({ message: 'Content must be a string!' })
    @IsDefined({ message: 'Content is required!' })
    content: string;
    
    @IsISO8601({ strict: true })
    @IsDefined({ message: 'Date is required!' })
    eventDate: Date;
}