import { Injectable, Logger } from '@nestjs/common';
import { translate } from '@vitalets/google-translate-api';

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);

  async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      const result = await translate(text, { to: targetLanguage });
      return result?.text ?? text;
    } catch (error: unknown) {
      this.logger.error(`Erro ao traduzir: ${JSON.stringify(error)}`);

      if (error instanceof Error) {
        this.logger.error(`Detalhes: ${error.message}`);
      }

      return text; 
    }
  }
}
