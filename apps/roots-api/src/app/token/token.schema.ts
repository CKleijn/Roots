import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IToken } from '@roots/data';
import { Types } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema()
export class Token implements IToken {
  @Prop({
    unique: true,
    required: true,
  })
  type: string;

  @Prop({
    required: true,
  })
  expirationDate: Date;

  @Prop({
    ref: 'User',
    type: Types.ObjectId,
  })
  userId: Types.ObjectId;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
