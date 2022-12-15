import { IsDefined, IsString, MaxLength } from 'class-validator';
import { IEvent } from 'libs/data/src/lib/data';

export class EventDto implements IEvent {
    @IsString({ message: 'Title must be a string!' })
    @IsDefined({ message: 'Title is required!' })
    @MaxLength(75, { message: 'Title can be maximal 75 characters!' })
    title: string;
    
    @IsString({ message: 'Description must be a string!' })
    @IsDefined({ message: 'Description is required!' })
    @MaxLength(150, { message: 'Description can be maximal 150 characters!' })
    description: string;

    @IsString({ message: 'Content must be a string!' })
    @IsDefined({ message: 'Content is required!' })
    content: string;
  
    @IsDefined({ message: 'Date is required!' })
    eventDate: Date;
}