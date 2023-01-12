import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { MailService } from '../providers/email/email.service';
import { Token } from '../token/token.schema';
import { TokenService } from '../token/token.service';
import { UserDto } from '../user/user.dto';
import { User } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    private tokenService: TokenService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user: User = await this.userService.findByEmailAddress(username);
    if (user && (await bcrypt.compareSync(pass, user.password))) {
      if (user.isActive === false) {
        throw new HttpException(
          `Jouw account is gedeactiveerd!`,
          HttpStatus.BAD_REQUEST
        );
      }

      if (user.isVerified) {
        await this.userService.setLastLoginTimeStamp(user._id.toString());
      }

      return user;
    }

    throw new HttpException(
      `Incorrecte inloggegevens!`,
      HttpStatus.BAD_REQUEST
    );
  }

  async register(UserDto: UserDto) {
    const user: User = await this.userService.create(UserDto);

    const token: Token = await this.tokenService.create(
      'verification',
      user._id.toString()
    );

    await this.mailService.SendVerificationMail(
      user.emailAddress,
      user.firstname,
      token.verificationCode
    );

    return user;
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
      isVerified: loggedInUser.isVerified,
      organization: loggedInUser.organization,
      access_token: this.jwtService.sign(payload, jwtConstants),
    };
  }
}
