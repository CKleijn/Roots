import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Public } from '../auth/auth.module';
import { ParseObjectIdPipe } from '../shared/pipes/ParseObjectIdPipe';
import { UserDto } from './user.dto';
import { User } from './user.schema';
import { UserService } from './user.service';

@Controller()
export class UserController {
  // Inject all dependencies
  constructor(private readonly userService: UserService) {}

  // Get all participants from organization
  @Public()
  @Get('organizations/:id/participants')
  async getParticipants(
    @Param('id', ParseObjectIdPipe) id: string
  ): Promise<User[]> {
    Logger.log(`Retrieve participants (READ)`);

    return await this.userService.getAllParticipants(id);
  }

  // Get user by id
  @Public()
  @Get('users/:id')
  async getById(@Param('id', ParseObjectIdPipe) id: string): Promise<User> {
    Logger.log(`Retrieve user with id: ${id} (READ)`);

    return await this.userService.getById(id);
  }

  // Create new user
  @Post('users/new')
  async create(@Body() UserDto: UserDto): Promise<User> {
    Logger.log(`Creating user (CREATE)`);

    return await this.userService.create(UserDto);
  }

  // Get user status (activated/deactivated)
  @Post('users/:id/status')
  async status(
    @Param('id', ParseObjectIdPipe) id: string,
    @Req() req
    // eslint-disable-next-line @typescript-eslint/ban-types
  ): Promise<User> {
    Logger.log(`Changing isActive status of user with an id of ${id} (POST)`);

    return await this.userService.status(id, req);
  }
}
