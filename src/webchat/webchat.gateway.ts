/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { WebchatMockService  } from "src/webchat-mock/webchat-mock.service";
import { IChatMessage } from "src/webchat-mock/entities/chatMessage.entity";

type ChatState = 'INITIAL' | 'UNAUTHORIZED' | 'PENDING_AUTH' | 'IN_PROGRESS' | 'FINISH_INTEND' | 'FINESHED';

interface ClientInfo {
  name: string;
  language?: string;
  email?: string;
  state: ChatState;
}

@WebSocketGateway({ cors: { origin: '*', credentials: true } })
export class WebchatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger = new Logger(WebchatGateway.name);
  private clientInfo: Map<string, ClientInfo> = new Map();
  private lastBotMessage: Map<string, IChatMessage> = new Map();

  constructor(
    private readonly webchatMockService: WebchatMockService
  ) {}

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log("Gateway Inicializado");
  }

  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Cliente conectado: ${client.id}`);
    
    this.clientInfo.set(client.id, { name: '', state: 'INITIAL' });
  }

  handleDisconnect(client: any) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
    this.clientInfo.delete(client.id);
    this.lastBotMessage.delete(client.id);
  }

  private emitMessage(client: any, event: string, chatMessage: IChatMessage) {
    client.emit(event, chatMessage);
    this.lastBotMessage.set(client.id, chatMessage);
  }

  @SubscribeMessage("authenticate")
  async handleAuthentication(client: any, loginData: any) {
    
    const clientData = this.clientInfo.get(client.id) || { name: '', state: 'INITIAL' };
    if (loginData && loginData.name) {
      clientData.name = loginData.name;
      if (loginData.email) {
        clientData.email = loginData.email;
      }
    }
    
    clientData.state = 'INITIAL';
    this.clientInfo.set(client.id, clientData);
    
    const welcome = await this.webchatMockService.getWelcomeMessage(undefined);
    this.emitMessage(client, "message", welcome);
  }

  @SubscribeMessage("chooseLanguage")
  async handleChooseLanguage(client: any, payload: any) {
    const language = payload?.language;
    const clientData = this.clientInfo.get(client.id);
    if (!clientData) return;

    clientData.language = language ?? 'pt';
    clientData.state = 'UNAUTHORIZED';
    this.clientInfo.set(client.id, clientData);

    if (clientData.email) {
      clientData.state = 'IN_PROGRESS';
      this.clientInfo.set(client.id, clientData);
      const greeting = await this.webchatMockService.getGreetingMessage(clientData.name, clientData.language ?? 'pt');
      this.emitMessage(client, "message", greeting);
      const subject = await this.webchatMockService.getInitialSubjectMessage(clientData.name, clientData.language ?? 'pt');
      this.emitMessage(client, "message", subject);
    } else {
      clientData.state = 'PENDING_AUTH';
      this.clientInfo.set(client.id, clientData);
      const authPrompt = await this.webchatMockService.getAuthPromptMessage(clientData.language ?? 'pt');
      this.emitMessage(client, "message", authPrompt);
    }
  }

  @SubscribeMessage("chooseOption")
  async handleChooseOption(client: any, payload: any) {
    this.logger.log("CHOOSE OPTION");
    const option = payload?.option;
    const clientData = this.clientInfo.get(client.id);
    if (!clientData) return;

    if (clientData.state === 'PENDING_AUTH' && option === 'auth') {
      clientData.name = "Posiflow";
      clientData.email = "posiflow@positivomais.com";
      clientData.state = 'IN_PROGRESS';
      this.clientInfo.set(client.id, clientData);
      const greeting = await this.webchatMockService.getGreetingMessage(clientData.name, clientData.language ?? 'pt');
      this.emitMessage(client, "message", greeting);
      const subject = await this.webchatMockService.getInitialSubjectMessage(clientData.name, clientData.language ?? 'pt');
      this.emitMessage(client, "message", subject);
      return;
    }
    
    if (clientData.state === 'IN_PROGRESS') {
      let optionMsg: IChatMessage;
      switch (option) {
        case "1":
          optionMsg = await this.webchatMockService.getHumanSupportMessage(clientData.language ?? 'pt');
          break;
        case "2":
          optionMsg = await this.webchatMockService.getDocumentAnalysisMessage(clientData.name, clientData.language ?? 'pt');
          break;
        case "3":
          optionMsg = await this.webchatMockService.getTicketInquiryMessage(clientData.name, clientData.language ?? 'pt');
          break;
        default: {
          const lastMsg = this.lastBotMessage.get(client.id);
          if (lastMsg) {
            this.emitMessage(client, "message", lastMsg);
          }
          return;
        }
      }
      this.emitMessage(client, "message", optionMsg);
    } else {
      const lastMsg = this.lastBotMessage.get(client.id);
      if (lastMsg) {
        this.emitMessage(client, "message", lastMsg);
      }
    }
  }

  @SubscribeMessage("finishIntendRequest")
  async handleFinishIntendRequest(client: any) {
    const clientData = this.clientInfo.get(client.id);
    if (!clientData) return;
    clientData.state = 'FINISH_INTEND';
    this.clientInfo.set(client.id, clientData);
    const name = clientData.name || "";
    const confirmMsg = await this.webchatMockService.getFinishIntendMessage(name, clientData.language ?? 'pt');
    this.emitMessage(client, "finishIntendResponse", confirmMsg);
  }

  @SubscribeMessage("finishIntendConfirm")
  async handleFinishConfirm(client: any, payload: any) {
    const clientData = this.clientInfo.get(client.id);
    if (!clientData) return;

    const option = payload?.option;
    if (option === '1') {
      clientData.state = 'FINESHED';
      this.clientInfo.set(client.id, clientData);
      const confirmResponse = await this.webchatMockService.getFinishConfirmationMessage(option, clientData.name, clientData.language ?? 'pt');
      if (confirmResponse) {
        this.emitMessage(client, "finishIntendResponse", confirmResponse);
      }
    } else if (option === '2') {
      clientData.state = 'IN_PROGRESS';
      this.clientInfo.set(client.id, clientData);
      const lastMsg = this.lastBotMessage.get(client.id);
      if (lastMsg) {
        this.emitMessage(client, "finishIntendResponse", lastMsg);
      }
    } else {
      const lastMsg = this.lastBotMessage.get(client.id);
      if (lastMsg) {
        this.emitMessage(client, "finishIntendResponse", lastMsg);
      }
    }
  }

  @SubscribeMessage("fallback")
  handleFallback(client: any) {
    const lastMsg = this.lastBotMessage.get(client.id);
    if (lastMsg) {
      this.emitMessage(client, "message", lastMsg);
    }
  }

  @SubscribeMessage("unrecognized")
  handleUnrecognized(client: any) {
    const lastMsg = this.lastBotMessage.get(client.id);
    if (lastMsg) {
      this.emitMessage(client, "message", lastMsg);
    }
  }

  @SubscribeMessage("sendMessage")
  async handleSendMessage(client: any, message: any) {
    this.logger.log("SEND MESSAGE");
    const clientData = this.clientInfo.get(client.id);
    if (!clientData) return;
    
    // Se a mensagem enviada tiver status FINISH_INTEND, iniciamos o fluxo de finalização
    if (message.status === 'FINISH_INTEND') {
      clientData.state = 'FINISH_INTEND';
      this.clientInfo.set(client.id, clientData);
      const name = clientData.name || "";
      const confirmMsg = await this.webchatMockService.getFinishIntendMessage(name, clientData.language ?? 'pt');
      this.emitMessage(client, "finishIntendResponse", confirmMsg);
      return;
    }

    
    if (clientData.state === 'IN_PROGRESS') {
      const lastMsg = this.lastBotMessage.get(client.id);
      if (lastMsg) {
        this.emitMessage(client, "message", lastMsg);
      }
    } else {
      
      this.logger.log(`Mensagem recebida de ${client.id}: ${JSON.stringify(message)}`);
      const lastMsg = this.lastBotMessage.get(client.id);
      if (lastMsg) {
        this.emitMessage(client, "message", lastMsg);
      }
    }
  }
}
