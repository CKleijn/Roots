import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from '../user/user.dto';
import { Public } from './auth.module';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.body);
  }

  @Public()
  @Post('auth/verify')
  async verify(@Body() body) {
    return this.authService.verify(body);
  }

  @Public()
  @Post('auth/resend')
  async resend(@Body() body) {
    return this.authService.resendVerificationMail(body.emailAddress);
  }

  @Public()
  @Post('auth/register')
  async register(@Body() UserDto: UserDto) {
    return this.authService.register(UserDto);
  }
}
