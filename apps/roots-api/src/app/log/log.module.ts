import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization } from '@roots/data';
import { LogController } from '../log/log.controller';
import { LogService } from '../log/log.service';
import { OrganizationSchema } from '../organization/organization.schema';
import { Log, LogSchema } from './log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }, {
      name: Organization.name, schema: OrganizationSchema
    }]),
  ],
  providers: [LogService],
  controllers: [LogController],
  exports: [MongooseModule, LogService],
})
export class LogModule {}
