import { Controller, Get, Param } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async findAll(): Promise<Company[]> {
    return this.companyService.findAll();
  }


  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Company | null> {
    return this.companyService.findByIdText(id);
  }
}
