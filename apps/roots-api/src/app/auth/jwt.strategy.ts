import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findByEmailAddress(payload.username);

    if (user) {
      return {
        _id: user._id,
        emailAddress: user.emailAddress,
        firstname: user.firstname,
        lastname: user.lastname,
      };
    } else {
      throw new HttpException('Login has expired!', HttpStatus.UNAUTHORIZED);
    }
  }
}
