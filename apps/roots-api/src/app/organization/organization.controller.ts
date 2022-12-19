import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { Public } from '../auth/auth.module';
import { ParseObjectIdPipe } from '../shared/pipes/ParseObjectIdPipe';
import { CreateOrganizationDTO } from './organization.dto';
import { Organization } from './organization.schema';
import { OrganizationService } from './organization.service';

@Controller()
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) { }

  @Public()
  @Get('organizations')
  async getAll(): Promise<Organization[]> {
    Logger.log(`Retrieve organization (READ)`);

    return await this.organizationService.getAll();
  }

  @Public()
  @Get('organizations/:id')
  async getById(@Param('id', ParseObjectIdPipe) id: string): Promise<Organization> {
    Logger.log(`Retrieve organization with id: ${id} (READ)`);

    return await this.organizationService.getById(id);
  }

  @Public()
  @Post('organizations')     
  async createCommunity(@Body() createOrganizationDto: CreateOrganizationDTO): Promise<Organization> {
    return await this.organizationService.create(createOrganizationDto);
  }
}    