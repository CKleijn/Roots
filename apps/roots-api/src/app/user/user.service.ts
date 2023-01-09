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
    const user = await this.userModel.findOne({ emailAddress });

    if (!user)
      throw new HttpException('User bestaat niet!', HttpStatus.NOT_FOUND);

    return user;
  }

  async getById(_id: string): Promise<User> {
    return await this.userModel.findOne({ _id });
  }

  async getAllParticipants(organizationId: string): Promise<User[]> {
    return await this.userModel.find({ organization: organizationId });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.validate(createUserDto);

    const newUser = new this.userModel({
      ...createUserDto,
      password: await bcrypt.hashSync(createUserDto.password, 10),
      isActive: true, //until email validation is implemented
      createdAt: new Date(),
      organization: await this.organizationService.getByEmailDomain(
        createUserDto.emailAddress.split('@').at(1)
      ),
    });

    return await this.userModel.create(newUser);
  }

  async setLastLoginTimeStamp(id: string) {
    return await this.userModel.findOneAndUpdate({ _id: id }, [
      { $set: { lastLoginTimestamp: new Date() } },
    ]);
  }

  async status(id: string, req: any): Promise<User> {
    const targetUser = await this.getById(id);

    if (
      targetUser.organization.toString() !== req.user.organization.toString()
    ) {
      throw new HttpException(
        `Je mag alleen gebruikers van activeren/deactiveren van het bedrijf waar je werkt!`,
        HttpStatus.BAD_REQUEST
      );
    }

    if (id.toString() === req.user._id.toString()) {
      throw new HttpException(
        `Je mag jouw eigen account niet activeren/deactiveren!`,
        HttpStatus.BAD_REQUEST
      );
    }

    return await this.userModel.findOneAndUpdate(
      { _id: id },
      [{ $set: { isActive: { $not: '$isActive' } } }],
      { new: true }
    );
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
