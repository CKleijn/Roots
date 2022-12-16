import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ICompany } from '@roots/data';
import { IsDefined, IsString } from 'class-validator';
import { Event, EventSchema } from '../event/event.schema';

export type CompanyDocument = Company & Document;

@Schema()
export class Company implements ICompany {
  
  @IsString({ message: 'Naam moet van het type string zijn!' })
  @IsDefined({ message: 'Naam is verplicht!' })
  @Prop()
  name: string;

  @IsString({ message: 'Email domein moet van het type string zijn!' })
  @IsDefined({ message: 'Email domein is verplicht!' })
  @Prop()
  emailDomain: string;

  @Prop({
    default:[],
    type:[EventSchema]
  })
  events: [Event];
}

export const CompanySchema = SchemaFactory.createForClass(Company);
