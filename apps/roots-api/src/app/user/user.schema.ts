import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser } from '@roots/data';
import { Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User implements IUser {
  _id: Types.ObjectId;

  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop()
  emailAddress: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
