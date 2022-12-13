import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCompanyDTO } from './company.dto';
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
    return await this.companyModel.find();
  }

  async create(createCompanyDTO : CreateCompanyDTO) {
    await this.validate(createCompanyDTO);

    const newCompany = new this.companyModel({
      ...createCompanyDTO,
    });

    return await this.companyModel.create(newCompany);
  }

  async validate(company: any) : Promise<void> {
    if((await this.companyModel.find({name: company.name})).length > 0) {
      throw new HttpException(`Company with this name already exists!`, HttpStatus.BAD_REQUEST);
    }

    if((await this.companyModel.find({emailDomain: company.emailDomain})).length > 0) {
      throw new HttpException(`Company with this email domain already exists!`, HttpStatus.BAD_REQUEST);
    }
  }
}
