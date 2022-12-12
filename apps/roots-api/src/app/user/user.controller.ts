import { Controller, Get, Logger, Param } from '@nestjs/common';
import { ParseObjectIdPipe } from '../shared/pipes/ParseObjectIdPipe';
import { User } from './user.schema';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users/:id')
  async getById(@Param('id', ParseObjectIdPipe) id: string): Promise<User> {
    Logger.log(`Retrieve user with id: ${id} (READ)`);

    return await this.userService.getById(id);
  }
}
