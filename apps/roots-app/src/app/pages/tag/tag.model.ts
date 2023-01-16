import { ITag } from '@roots/data';
import { Types } from 'mongoose';

// Create instance of Tag
export class Tag implements ITag {
  _id = new Types.ObjectId();
  name = '';
  organization = '';
}
