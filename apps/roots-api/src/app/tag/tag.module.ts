import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Organization,
  OrganizationSchema,
} from '../organization/organization.schema';
import { TagController } from './tag.controller';
import { Tag, TagSchema } from './tag.schema';
import { TagService } from './tag.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
    ]),
  ],
  providers: [TagService],
  controllers: [TagController],
  exports: [MongooseModule, TagService],
})
export class TagModule {}
