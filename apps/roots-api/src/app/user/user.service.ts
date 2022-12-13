import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './user.dto';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmailAddress(emailAddress: string): Promise<User> {
    return await this.userModel.findOne({ emailAddress });
  }

  async getById(_id: string): Promise<User> {
    return await this.userModel.findOne({ _id });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel({
      ...createUserDto,
      password: await bcrypt.hashSync(createUserDto.password, 10)
    })

    return await this.userModel.create(newUser);
  }
}
