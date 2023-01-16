import { Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ValidationException } from '../filters/validation.exception';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, ObjectId> {
  public transform(value: any): ObjectId {
    try {
      const transformedObjectId: ObjectId = ObjectId.createFromHexString(value);
      return transformedObjectId;
    } catch (error) {
      throw new ValidationException([
        `ObjectId has wrong value: ${value}, ObjectId is not valid!`,
      ]);
    }
  }

  public static isValidObjectId(value: any): boolean {
    try {
      ObjectId.createFromHexString(value);
      return true;
    } catch (error) {
      return false;
    }
  }
}
