import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from '../company/entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
  ) {}

  async findAll(): Promise<Company[]> {
    return this.companyModel.find().exec();
  }

  async findByIdText(id: string): Promise<Company | null> {
    return this.companyModel.findOne({ id }).exec();
  }
  
}
