import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { Public } from '../auth/auth.module';
import { ParseObjectIdPipe } from '../shared/pipes/ParseObjectIdPipe';
import { LogDTO } from './log.dto';
import { Log } from './log.schema';
import { LogService } from './log.service';


@Controller()
export class LogController {
  constructor(private readonly logService: LogService) { }

  @Public()
  @Get('log/:organizationId')
  async getAll(@Param('organizationId') organizationId: string): Promise<Log[]> {
    Logger.log(`Retrieve logs (READ)`);

    return await this.logService.getAll(organizationId);
  }

  @Public()
  @Post('log/:organizationId')     
  async createLog(@Param('organizationId') organizationId: string, @Body() logDto:LogDTO): Promise<Log> {
    return await this.logService.create(organizationId,logDto);
  }
}    