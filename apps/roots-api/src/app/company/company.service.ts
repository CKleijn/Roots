import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyDTO } from './company.dto';
import { Company, CompanyDocument } from './company.schema';

@Injectable()
export class CompanyService {
 
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>
  ) {}

  async getByEmailDomain(emailDomain: string): Promise<Company | undefined> {
    return await this.companyModel.findOne({ emailDomain });
  }

  async getById(_id: string): Promise<Company> {
    return await this.companyModel.findOne({ _id });
  }

  async getAll(): Promise<Company[]> {
    return await this.companyModel.find()
  }

 
}
