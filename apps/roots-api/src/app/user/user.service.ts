import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { OrganizationService } from '../organization/organization.service';
import { UserDto } from './user.dto';
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
      throw new HttpException('Gebruiker bestaat niet!', HttpStatus.NOT_FOUND);

    return user;
  }

  async getById(_id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id });

    if (!user)
      throw new HttpException('Gebruiker bestaat niet!', HttpStatus.NOT_FOUND);

    return user;
  }

  async getAllParticipants(organizationId: string): Promise<User[]> {
    return await this.userModel.find({ organization: organizationId });
  }

  async create(UserDto: UserDto): Promise<User> {
    await this.validate(UserDto);

    const newUser = new this.userModel({
      ...UserDto,
      password: await bcrypt.hashSync(UserDto.password, 10),
      isActive: true,
      isVerified: false,
      createdAt: new Date(),
      organization: await this.organizationService.getByEmailDomain(
        UserDto.emailAddress.split('@').at(1)
      ),
    });

    return await this.userModel.create(newUser);
  }

  async setLastLoginTimeStamp(id: string) {
    const user = await this.userModel.findOneAndUpdate({ _id: id }, [
      { $set: { lastLoginTimestamp: new Date() } },
    ]);

    if (!user)
      throw new HttpException('Gebruiker bestaat niet!', HttpStatus.NOT_FOUND);

    return user;
  }

  async verifyAccount(userId: string) {
    const user = await this.userModel.findOneAndUpdate({ _id: userId }, [
      { $set: { isVerified: true } },
    ]);

    if (!user)
      throw new HttpException('Gebruiker bestaat niet!', HttpStatus.NOT_FOUND);

    return user;
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
  }
}
