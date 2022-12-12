import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { ICompany } from '@roots/data';
import { Types } from 'mongoose';

export type CompanyDocument = Company & Document;

@Schema()
export class Company implements ICompany {
  _id: Types.ObjectId;
  name: string;
  emailDomain: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
