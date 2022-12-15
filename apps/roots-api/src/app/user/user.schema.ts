import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser } from '@roots/data';
import { IsDefined, IsEmail, IsString, Matches } from 'class-validator';
import { ObjectId, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User implements IUser {
  _id: Types.ObjectId;

  @Prop()
  @IsString({ message: 'Firstname must be a string!' })
  @IsDefined({ message: 'Firstname is required!' })
  firstname: string;

  @Prop()
  @IsString({ message: 'Lastname must be a string!' })
  @IsDefined({ message: 'Lastname is required!' })
  lastname: string;

  @Prop()
  @IsEmail()
  @IsString({ message: 'Email must be a string!' })
  @IsDefined({ message: 'Email is required!' })
  emailAddress: string;

  @Prop()
  @IsString({ message: 'Password must be a string!' })
  @IsDefined({ message: 'Password is required!' })
  @Matches(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"),{ message: 'Password not strong enough! Must contain at least: 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number!' })
  password: string;

  @Prop({ref: 'Company'})
  company: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
