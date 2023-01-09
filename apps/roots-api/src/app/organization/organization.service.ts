import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrganizationDTO } from './organization.dto';
import { Organization, OrganizationDocument } from './organization.schema';

@Injectable()
export class OrganizationService {
 
  constructor(
    @InjectModel(Organization.name) private organizationModel: Model<OrganizationDocument>
  ) {}

  async getByEmailDomain(emailDomain: string): Promise<Organization | undefined> {
    return await this.organizationModel.findOne({ emailDomain });
  }

  async getById(_id: string): Promise<Organization> {
    return await this.organizationModel.findOne({ _id });
  }

  async getAll(): Promise<Organization[]> {
    return await this.organizationModel.find();
  }

  async create(createOrganizationDTO : CreateOrganizationDTO): Promise<Organization> {
    await this.validate(createOrganizationDTO);

    const newOrganization = new this.organizationModel({
      ...createOrganizationDTO,
    });

    return await this.organizationModel.create(newOrganization);
  }

  async validate(organization: any) : Promise<void> {
    if((await this.organizationModel.find({name: organization.name})).length > 0) {
      throw new HttpException(`Er bestaat al een bedrijf met de opgegeven naam!`, HttpStatus.BAD_REQUEST);
    }

    if((await this.organizationModel.find({emailDomain: organization.emailDomain})).length > 0) {
      throw new HttpException(`Er bestaat al een bedrijf met het opgegeven email domein!`, HttpStatus.BAD_REQUEST);
    }
  }
}