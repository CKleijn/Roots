import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ICompany } from '@roots/data';
import { Types } from 'mongoose';
import { EventSchema } from '../event/event.schema';
import { Event } from '../event/event.schema'

export type CompanyDocument = Company & Document;

@Schema()
export class Company implements ICompany {
  @Prop()
  name: string;

  @Prop()
  emailDomain: string;

  @Prop({
    default:[],
    type:[EventSchema]
  })
  events: [Event];
}

export const CompanySchema = SchemaFactory.createForClass(Company);
