import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { MailService } from '../providers/email/email.service';
import { ParseObjectIdPipe } from '../shared/pipes/ParseObjectIdPipe';
import { Token } from '../token/token.schema';
import { TokenService } from '../token/token.service';
import { UserDto } from '../user/user.dto';
import { User } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  // Inject all dependencies
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    private tokenService: TokenService
  ) {}

  // Login user
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

  // Register new user/organization + create token + send verify mail
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

  // Check if user is active
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

  // Verify user
  async verify(req: any) {
    //check if object id is valid
    if (!ParseObjectIdPipe.isValidObjectId(req.userId)) {
      throw new HttpException('Id is niet geldig!', HttpStatus.BAD_REQUEST);
    }

    //check if user exists (validation is elsewhere)
    const user = await this.userService.getById(req.userId);

    //retrieve existing token
    const token = await this.tokenService.getByUserId(
      req.userId,
      'verification'
    );

    //check if token is correct + not expired
    if (
      token.verificationCode === req.verificationCode &&
      token.expirationDate > new Date()
    ) {
      //delete used token
      await this.tokenService.delete(req.userId, 'verification');

      //change isVerified to true
      await this.userService.verifyAccount(req.userId);

      //set first login timestamp
      await this.userService.setLastLoginTimeStamp(req.userId);

      //login automatically
      return await this.login({
        username: user.emailAddress,
        password: user.password,
      });
    } else {
      throw new HttpException(
        'De verificatiecode is ongeldig!',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // Resend verification mail
  async resendVerificationMail(emailAddress: string) {
    //retrieve user + check if exists
    const user = await this.userService.findByEmailAddress(emailAddress);

    //delete previous token
    await this.tokenService.delete(user._id.toString(), 'verification');

    //create new token
    const token = await this.tokenService.create(
      'verification',
      user._id.toString()
    );

    //send email with new verificationcode
    await this.mailService.SendVerificationMail(
      user.emailAddress,
      user.firstname,
      token.verificationCode
    );

    return {
      status: 200,
      message: 'Verification Email has been sent!',
    };
  }

  // Send forgot password mail
  async forgotPasswordMail(emailAddress: string) {
    //retrieve user + check if exists
    const user = await this.userService.findByEmailAddress(emailAddress);

    //delete previous tokens (if there are any)
    await this.tokenService.delete(user._id.toString(), 'password_reset');

    //create new token
    const token = await this.tokenService.create(
      'password_reset',
      user._id.toString()
    );

    //send email with link for password reset
    await this.mailService.SendPasswordResetMail(
      user.emailAddress,
      user.firstname,
      token._id.toString()
    );

    return {
      status: 200,
      message: 'Reset Password Email has been sent!',
    };
  }

  // Reset password
  async resetPassword(tokenId: string, password: string) {
    //retrieve user + check if exists
    const token = await this.tokenService.getById(tokenId);

    //delete previous tokens (if there are any)
    await this.tokenService.delete(token.userId.toString(), 'password_reset');

    if (token.expirationDate > new Date()) {
      //reset password
      await this.userService.setPassword(token.userId.toString(), password);

      return {
        status: 200,
        message: 'Password has been reset!',
      };
    } else {
      throw new HttpException('Token is ongeldig!', HttpStatus.BAD_REQUEST);
    }
  }
}
