import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { Public } from '../auth/auth.module';
import { ParseObjectIdPipe } from '../shared/pipes/ParseObjectIdPipe';
import { CreateUserDto } from './user.dto';
import { User } from './user.schema';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get('users/:id')
  async getById(@Param('id', ParseObjectIdPipe) id: string): Promise<User> {
    Logger.log(`Retrieve user with id: ${id} (READ)`);

    return await this.userService.getById(id);
  }

  @Post('users/new')
  async create(@Body() createUserDto : CreateUserDto) : Promise<User> {
    Logger.log(`Creating user (CREATE)`);

    return await this.userService.create(createUserDto)
  }
}
