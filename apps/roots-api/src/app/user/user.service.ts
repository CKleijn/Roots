import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmailAddress(emailAddress: string): Promise<User> {
    return await (await this.userModel.findOne({ emailAddress })).toObject();
  }

  async getById(_id: string): Promise<User> {
    return await this.userModel.findOne({ _id });
  }
}
