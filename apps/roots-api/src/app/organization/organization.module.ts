import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Log } from '@roots/data';
import { LogSchema } from '../log/log.schema';
import { OrganizationController } from './organization.controller';
import { Organization, OrganizationSchema } from './organization.schema';
import { OrganizationService } from './organization.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Organization.name, schema: OrganizationSchema }]),
  ],
  providers: [OrganizationService],
  controllers: [OrganizationController],
  exports: [MongooseModule, OrganizationService],
})
export class OrganizationModule {}
