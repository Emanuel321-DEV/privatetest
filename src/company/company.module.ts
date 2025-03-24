import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './entities/company.entity';

@Module({
  controllers: [CompanyController],
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
  ],
  providers: [CompanyService],
})
export class CompanyModule {}
