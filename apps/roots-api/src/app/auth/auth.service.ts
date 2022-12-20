import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../user/user.dto';
import { User } from '../user/user.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user: User = await this.userService.findByEmailAddress(username);

    if (user && (await bcrypt.compareSync(pass, user.password))) {
      return user;
    }

    throw new HttpException(`Incorrecte inloggegevens!`, HttpStatus.BAD_REQUEST);
  }

  async register(createUserDto: CreateUserDto) {
    const user: User = await this.userService.create(createUserDto);
    return this.login(user);
  }

  async login(user: any) {
    const payload = { username: user.username || user.emailAddress };

    const loggedInUser = await this.userService.findByEmailAddress(
      payload.username
    );

    return {
      _id: loggedInUser._id,
      firstname: loggedInUser.firstname,
      lastname: loggedInUser.lastname,
      emailAddress: loggedInUser.emailAddress,
      organization: loggedInUser.organization,
      access_token: this.jwtService.sign(payload),
    };
  }
}
