import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser } from '@roots/data';
import {
  IsDefined,
  isEmail,
  IsEmail,
  IsString,
  Matches,
} from 'class-validator';
import { Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User implements IUser {
  _id: Types.ObjectId;

  @Prop({
    required: true,
  })
  @IsString({ message: 'Voornaam moet van het type string zijn!' })
  @IsDefined({ message: 'Voornaam is verplicht!' })
  firstname: string;

  @Prop({
    required: true,
  })
  @IsString({ message: 'Achternaam moet van het type string zijn!' })
  @IsDefined({ message: 'Achternaam is verplicht!' })
  lastname: string;

  @IsEmail()
  @IsString({ message: 'E-mailadres moet van het type string zijn!' })
  @IsDefined({ message: 'E-mailadres is verplicht!' })
  @Prop({
    required: true,
    unique: true,
    validate: isEmail,
  })
  emailAddress: string;

  @Prop({
    required: true,
  })
  @IsString({ message: 'Wachtwoord moet van het type string zijn!' })
  @IsDefined({ message: 'Wachtwoord is verplicht!' })
  @Matches(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$'), {
    message:
      'Het wachtwoord is niet sterk genoeg! Het moet op zijn minst bestaan uit: 8 karakters, 1 hoofdletter, 1 kleine letter and 1 getal!',
  })
  password: string;

  @Prop()
  isActive: boolean;

  @Prop()
  isVerified: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  lastLoginTimestamp: Date;

  @Prop({
    ref: 'Organization',
    type: Types.ObjectId,
  })
  organization: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
