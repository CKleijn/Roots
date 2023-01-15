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

  // Check if user JWT token is valid
  async validate(payload: any) {
    const user = await this.userService.findByEmailAddress(payload.username);

    if (user) {
      return user;
    } else {
      throw new HttpException('Login is verlopen!', HttpStatus.UNAUTHORIZED);
    }
  }
}
