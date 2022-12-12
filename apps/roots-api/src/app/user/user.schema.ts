import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser } from '@roots/data';
import { Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User implements IUser {
  _id: Types.ObjectId;
  firstname: string;
  lastname: string;
  emailAddress: string;
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
