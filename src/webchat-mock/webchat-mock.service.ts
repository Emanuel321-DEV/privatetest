/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IChatMessage } from '../webchat-mock/entities/chatMessage.entity'; // Certifique-se de ter definido esse schema

@Injectable()
export class WebchatMockService {
  constructor(
    @InjectModel('ChatMessage') 
    private readonly chatMessageModel: Model<IChatMessage>
  ) {}

  /**
   * Busca no banco a mensagem de saudação e substitui o placeholder pelo nome do usuário.
   */
  async getGreetingMessage(userName: string, lang: string | undefined): Promise<IChatMessage> {
    const messageTemplate = await this.chatMessageModel.findOne({ category: 'greeting', lang });
    if (!messageTemplate) {
      throw new NotFoundException('Template de mensagem de saudação não encontrado');
    }
    const message = messageTemplate.toObject();
    message.text = message.text.replace('{{userName}}', userName);
    message.timestamp = new Date();
    return message;
  }

  /**
   * Busca a mensagem padrão para usuário não autenticado.
   */
  async getDefaultMessage(lang: string | undefined): Promise<IChatMessage> {
    const messageTemplate = await this.chatMessageModel.findOne({ category: 'default', lang });
    if (!messageTemplate) {
      throw new NotFoundException('Template de mensagem padrão não encontrado');
    }
    const message = messageTemplate.toObject();
    message.timestamp = new Date();
    return message;
  }

  /**
   * Busca a mensagem de boas-vindas, que pode incluir botões para escolha de idioma.
   */
  async getWelcomeMessage(lang: string | undefined): Promise<IChatMessage> {
    const messageTemplate = await this.chatMessageModel.findOne({ category: 'welcome' });
    if (!messageTemplate) {
      throw new NotFoundException('Template de mensagem de boas-vindas não encontrado');
    }
    const message = messageTemplate.toObject();
    message.timestamp = new Date();
    return message;
  }

  /**
   * Busca a mensagem de solicitação de autenticação.
   */
  async getAuthPromptMessage(lang: string | undefined): Promise<IChatMessage> {
    const messageTemplate = await this.chatMessageModel.findOne({ category: 'auth', lang });
    if (!messageTemplate) {
      throw new NotFoundException('Template de mensagem de autenticação não encontrado');
    }
    const message = messageTemplate.toObject();
    message.timestamp = new Date();
    return message;
  }

  /**
   * Busca a mensagem com escolha do assunto e substitui o placeholder do nome.
   */
  async getInitialSubjectMessage(userName: string, lang: string | undefined): Promise<IChatMessage> {
    const messageTemplate = await this.chatMessageModel.findOne({ category: 'subject', lang });
    if (!messageTemplate) {
      throw new NotFoundException('Template de mensagem de assunto não encontrado');
    }
    const message = messageTemplate.toObject();
    message.text = message.text.replace('{{userName}}', userName);
    message.timestamp = new Date();
    return message;
  }

  /**
   * Busca a mensagem para atendimento humano.
   */
  async getHumanSupportMessage(lang: string | undefined): Promise<IChatMessage> {
    const messageTemplate = await this.chatMessageModel.findOne({ category: 'human_support', lang });
    if (!messageTemplate) {
      throw new NotFoundException('Template de mensagem de atendimento humano não encontrado');
    }
    const message = messageTemplate.toObject();
    message.timestamp = new Date();
    return message;
  }

  /**
   * Busca a mensagem para análise de documentos e substitui o placeholder do nome do usuário.
   */
  async getDocumentAnalysisMessage(userName: string, lang: string | undefined): Promise<IChatMessage> {
    const messageTemplate = await this.chatMessageModel.findOne({ category: 'document_analysis', lang });
    if (!messageTemplate) {
      throw new NotFoundException('Template de mensagem de análise de documentos não encontrado');
    }
    const message = messageTemplate.toObject();
    message.text = message.text.replace('{{userName}}', userName);
    message.timestamp = new Date();
    return message;
  }

  /**
   * Busca a mensagem para consulta de chamados e substitui o placeholder do nome.
   */
  async getTicketInquiryMessage(userName: string, lang: string | undefined): Promise<IChatMessage> {
    const messageTemplate = await this.chatMessageModel.findOne({ category: 'ticket_inquiry', lang });
    if (!messageTemplate) {
      throw new NotFoundException('Template de mensagem de consulta de chamados não encontrado');
    }
    const message = messageTemplate.toObject();
    message.text = message.text.replace('{{userName}}', userName);
    message.timestamp = new Date();
    return message;
  }

  /**
   * Busca a mensagem de confirmação de encerramento do chat e substitui o placeholder, se necessário.
   */
  async getFinishIntendMessage(userName: string, lang: string | undefined): Promise<IChatMessage> {
    const messageTemplate = await this.chatMessageModel.findOne({ category: 'finish_intend', lang });
    if (!messageTemplate) {
      throw new NotFoundException('Template de mensagem de encerramento não encontrado');
    }
    const message = messageTemplate.toObject();
    message.text = message.text.replace('{{userName}}', userName);
    message.timestamp = new Date();
    return message;
  }

  /**
   * Busca a mensagem de confirmação após a escolha de encerramento.
   * Se o usuário optar por encerrar (option === '1'), busca o template de encerramento;
   * caso contrário, busca o template para continuar a conversa.
   */
  async getFinishConfirmationMessage(option: string, userName: string, lang: string | undefined): Promise<IChatMessage> {
    let category = '';
    if (option === '1') {
      category = 'finish_confirmation_yes';
    } else if (option === '2') {
      category = 'finish_confirmation_no';
    } else {
      throw new NotFoundException('Opção de confirmação inválida');
    }
    const messageTemplate = await this.chatMessageModel.findOne({ category, lang });
    if (!messageTemplate) {
      throw new NotFoundException('Template de mensagem de confirmação não encontrado');
    }
    const message = messageTemplate.toObject();
    message.text = message.text.replace('{{userName}}', userName);
    message.timestamp = new Date();
    return message;
  }

  /**
   * Retorna uma resposta automática. Se não houver template definido para o idioma, utiliza um fallback.
   */
  async getAutomaticResponse(lang?: string): Promise<string> {
    const language = lang || 'pt';
    const messageTemplate = await this.chatMessageModel.findOne({ category: 'automatic_response', lang: language });
    if (!messageTemplate) {
      return 'Olá! Isso é uma resposta automática.';
    }
    return messageTemplate.text;
  }
}
