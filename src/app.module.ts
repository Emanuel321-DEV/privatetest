import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebchatGateway } from './webchat/webchat.gateway';
import { WebchatMockService } from './webchat-mock/webchat-mock.service';
import { CompanyModule } from './company/company.module';
import { ChatMessageSchema } from './webchat-mock/entities/chatMessage.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CompanyModule,
    MongooseModule.forRoot('mongodb+srv://emanuelhvd:91fefbe2-e0ff-4c95-bb1d-ae9768a214cf@cluster0.5yq2j.mongodb.net/posiflow?appName=Cluster0'),
    MongooseModule.forFeature([{ name: 'ChatMessage', schema: ChatMessageSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService, WebchatGateway, WebchatMockService ],
})
export class AppModule {}
