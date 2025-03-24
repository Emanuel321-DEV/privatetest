import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompanyDocument = Company & Document;

@Schema()
export class Company {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  logoMain: string;

  @Prop()
  description: string;

  @Prop()
  buttonFinishChat: string;

  @Prop()
  inputSendMsg: string;

  @Prop()
  defaultLanguage: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
