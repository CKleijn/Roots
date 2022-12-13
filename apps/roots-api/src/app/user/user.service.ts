import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { CreateUserDto } from './user.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,) {}

  async findByEmailAddress(emailAddress: string): Promise<User> {
    return await this.userModel.findOne({ emailAddress });
  }

  async getById(_id: string): Promise<User> {
    return await this.userModel.findOne({ _id });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.validate(createUserDto);

    const newUser = new this.userModel({
      ...createUserDto,
      password: await bcrypt.hashSync(createUserDto.password, 10),
    });

    return await this.userModel.create(newUser);
  }

  async validate(user) {
    if((await this.userModel.find({emailAddress: user.emailAddress})).length > 0){
      throw new HttpException(`Email address is already in use!`, HttpStatus.BAD_REQUEST);
    }

    // if() {
    //   throw new HttpException(`There's no company registered for the given email domain!`, HttpStatus.BAD_REQUEST);
    // }
  }

}
