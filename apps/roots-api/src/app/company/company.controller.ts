import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { Public } from '../auth/auth.module';
import { ParseObjectIdPipe } from '../shared/pipes/ParseObjectIdPipe';
import { CompanyDTO } from './company.dto';
import { Company } from './company.schema';
import { CompanyService } from './company.service';

@Controller()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @Public()
  @Get('companies')
  async getAll(): Promise<Company[]> {
    Logger.log(`Retrieve companies (READ)`);

    return await this.companyService.getAll();
  }

  @Public()
  @Get('companies/:id')
  async getById(@Param('id', ParseObjectIdPipe) id: string): Promise<Company> {
    Logger.log(`Retrieve company with id: ${id} (READ)`);

    return await this.companyService.getById(id);
  }
}
