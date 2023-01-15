import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from '../user/user.dto';
import { Public } from './auth.module';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  // Inject all dependencies
  constructor(private readonly authService: AuthService) {}

  // Login user
  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.body);
  }

  // Register user/organization
  @Public()
  @Post('auth/register')
  async register(@Body() UserDto: UserDto) {
    return this.authService.register(UserDto);
  }

  // Verify user
  @Public()
  @Post('auth/verify')
  async verify(@Body() body) {
    return this.authService.verify(body);
  }

  // Resend verification mail
  @Public()
  @Post('auth/resend')
  async resend(@Body() body) {
    return this.authService.resendVerificationMail(body.emailAddress);
  }

  // Send reset password mail
  @Public()
  @Post('auth/forgot_password')
  async forgotPassword(@Body() body) {
    return this.authService.forgotPasswordMail(body.emailAddress);
  }

  // Reset password
  @Public()
  @Post('auth/reset_password')
  async resetPassword(@Body() body) {
    return this.authService.resetPassword(body.tokenId, body.password);
  }
}
