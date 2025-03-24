import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebchatGateway } from './webchat/webchat.gateway';
import { WebchatMockService } from './webchat-mock/webchat-mock.service';
import { TranslationService } from './translation/translation.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, WebchatGateway, WebchatMockService, TranslationService],
})
export class AppModule {}
