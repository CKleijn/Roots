import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { OrganizationService } from '../organization/organization.service';
import { CreateUserDto } from './user.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly organizationService: OrganizationService
  ) {}

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
      organization: await this.organizationService.getByEmailDomain(
        createUserDto.emailAddress.split('@').at(1)
      ),
    });

    return await this.userModel.create(newUser);
  }

  async validate(user) {
    if (
      (await this.userModel.find({ emailAddress: user.emailAddress })).length >
      0
    ) {
      throw new HttpException(
        `Het e-mailadres is al in gebruik!`,
        HttpStatus.BAD_REQUEST
      );
    }

    if (
      (await this.organizationService.getByEmailDomain(
        user.emailAddress.split('@').at(1)
      )) === null
    ) {
      throw new HttpException(
        `Er bestaat geen bedrijf met het opgegeven email domein!`,
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
