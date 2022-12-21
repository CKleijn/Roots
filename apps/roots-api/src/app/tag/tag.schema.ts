import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ITag } from '@roots/data';
import { Types } from 'mongoose';

export type TagDocument = Tag & Document;

@Schema()
export class Tag implements ITag {
  @Prop({
    unique: true
  })
  name: string;

  @Prop({
    type: Types.ObjectId
  })
  organization: Types.ObjectId
}

export const TagSchema = SchemaFactory.createForClass(Tag);