import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IOrganization } from '@roots/data';
import { IsDefined, IsString } from 'class-validator';
import { Event, EventSchema } from '../event/event.schema';

export type OrganizationDocument = Organization & Document;

@Schema()
export class Organization implements IOrganization {
  
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

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
