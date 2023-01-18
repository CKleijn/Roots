import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization } from '@roots/data';
import { Model } from 'mongoose';
import { OrganizationDocument } from '../organization/organization.schema';
import { LogDTO } from './log.dto';
import { Log, LogDocument } from './log.schema';

@Injectable()
export class LogService {
  constructor(
    @InjectModel(Log.name)
    private LogModel: Model<LogDocument>,
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>
  ) {}

  async getAll(organizationId: string): Promise<Log[]> {
    return await this.organizationModel.findOne(
      { _id: organizationId },
      { logs: 1 }
    );
  }

  async create(organizationId: string, logDto: LogDTO): Promise<Log> {
    return await this.organizationModel.findOneAndUpdate(
      { _id: organizationId },
      {
        $push: {
          logs: logDto,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }
}
