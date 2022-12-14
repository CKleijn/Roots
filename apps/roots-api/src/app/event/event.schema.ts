import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IEvent } from '@roots/data';

export type EventDocument = Event & Document;

@Schema()
export class Event implements IEvent {
  @Prop({
    required: [true, 'Title is required!'],
    maxLength: [75, 'Title can be maximal 75 characters!']
  })
  title: string;

  @Prop({
    required: [true, 'Description is required!'],
    maxLength: [150, 'Description can be maximal 150 characters!']
  })
  description: string;

  @Prop({
    required: [true, 'Content is required!']
  })
  content: string;

  @Prop({
    required: [true, 'Date is required!']
  })
  eventDate: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);