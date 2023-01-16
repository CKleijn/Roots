import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from '../organization/organization.schema';
import { EventController } from './event.controller';
import { EventSchema } from './event.schema';
import { EventService } from './event.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Organization.name, schema: OrganizationSchema }]),
  ],
  providers: [EventService],
  controllers: [EventController],
  exports: [EventService],
})
export class EventModule {}
