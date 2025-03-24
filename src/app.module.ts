import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebchatGateway } from './webchat/webchat.gateway';
import { WebchatMockService } from './webchat-mock/webchat-mock.service';
import { TranslationService } from './translation/translation.service';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CompanyModule,
    MongooseModule.forRoot(process.env.MONGODB_URI || ''),
  ],
  controllers: [AppController],
  providers: [AppService, WebchatGateway, WebchatMockService, TranslationService],
})
export class AppModule {}
