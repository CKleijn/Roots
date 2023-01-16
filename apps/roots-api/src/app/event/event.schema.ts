import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IEvent } from '@roots/data';
import { Types } from 'mongoose';

export type EventDocument = Event & Document;

@Schema()
export class Event implements IEvent {
  @Prop({
    required: [true, 'Titel is verplicht!'],
    maxLength: [75, 'Titel mag maximaal 75 karakters bevatten!']
  })
  title: string;

  @Prop({
    required: [true, 'Beschrijving is verplicht!'],
    maxLength: [150, 'Beschrijving mag maximaal 150 karakters bevatten!']
  })
  description: string;

  @Prop({
    required: [true, 'Inhoud is verplicht!']
  })
  content: string;

  @Prop({
    required: [true, 'Gebeurtenisdatum is verplicht!']
  })
  eventDate: Date;

  @Prop({
    default: [],
    type: [Types.ObjectId]
  })
  tags: [Types.ObjectId]

  @Prop({
    default:true
  })
  isActive: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);
