import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IOrganization } from '@roots/data';
import { IsDefined, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { LogSchema } from '../log/log.schema';

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
    default: [],
    type:[Types.ObjectId]
  })
  events: [Types.ObjectId];

  @Prop({
    default: [],
    type: [Types.ObjectId]
  })
  tags: [Types.ObjectId]

  @Prop({
    default:[],
    type:[LogSchema]
  })
  logs: []
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
