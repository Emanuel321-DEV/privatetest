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
import { Console } from "console";
import { Server } from "socket.io";
import { WebchatMockService, ChatMessage } from "src/webchat-mock/webchat-mock.service";

type ChatState = 'INITIAL' | 'UNAUTHORIZED' | 'PENDING_AUTH' | 'IN_PROGRESS' | 'FINISH_INTEND' | 'FINESHED';

interface ClientInfo {
  name: string;
  language?: string;
  email?: string;
  state: ChatState;
}

@WebSocketGateway({ cors: { origin: 'http://localhost:4200', credentials: true } })
export class WebchatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger = new Logger(WebchatGateway.name);
  private clientInfo: Map<string, ClientInfo> = new Map();
  private lastBotMessage: Map<string, ChatMessage> = new Map();

  constructor(
    private readonly webchatMockService: WebchatMockService
  ) {}

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log("Gateway Inicializado");
  }

  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Cliente conectado: ${client.id}`);
    // Ao conectar, definimos o estado inicial
    this.clientInfo.set(client.id, { name: '', state: 'INITIAL' });
  }

  handleDisconnect(client: any) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
    this.clientInfo.delete(client.id);
    this.lastBotMessage.delete(client.id);
  }

  private emitMessage(client: any, event: string, chatMessage: ChatMessage) {
    client.emit(event, chatMessage);
    this.lastBotMessage.set(client.id, chatMessage);
  }

  @SubscribeMessage("authenticate")
  handleAuthentication(client: any, loginData: any) {
    console.log("AUTHENTICATE CALLED");
    // Armazenamos os dados de autenticação recebidos
    const clientData = this.clientInfo.get(client.id) || { name: '', state: 'INITIAL' };
    if (loginData && loginData.name) {
      clientData.name = loginData.name;
      if (loginData.email) {
        clientData.email = loginData.email;
      }
    }
    // Mantemos o estado INITIAL e enviamos a mensagem de escolha de idioma
    clientData.state = 'INITIAL';
    this.clientInfo.set(client.id, clientData);
    const welcome = this.webchatMockService.getWelcomeMessage(undefined); // mensagem multilíngue com botões de idioma
    this.emitMessage(client, "message", welcome);
  }

  @SubscribeMessage("chooseLanguage")
  handleChooseLanguage(client: any, payload: any) {
    const language = payload?.language;
    const clientData = this.clientInfo.get(client.id);
    if (!clientData) return;

    clientData.language = language;
    // Após escolher o idioma, definimos o estado como UNAUTHORIZED
    clientData.state = 'UNAUTHORIZED';
    this.clientInfo.set(client.id, clientData);

    // Verifica se o usuário já enviou o email na autenticação
    if (clientData.email) {
      // Usuário autenticado: envia saudação e mensagem de assunto
      clientData.state = 'IN_PROGRESS';
      this.clientInfo.set(client.id, clientData);
      const greeting = this.webchatMockService.getGreetingMessage(clientData.name, clientData.language);
      this.emitMessage(client, "message", greeting);
      const subject = this.webchatMockService.getInitialSubjectMessage(clientData.name, clientData.language);
      this.emitMessage(client, "message", subject);
    } else {
      // Usuário não autenticado: solicita autenticação
      clientData.state = 'PENDING_AUTH';
      this.clientInfo.set(client.id, clientData);
      const authPrompt = this.webchatMockService.getAuthPromptMessage(clientData.language);
      this.emitMessage(client, "message", authPrompt);
    }
  }

  @SubscribeMessage("chooseOption")
  handleChooseOption(client: any, payload: any){
    console.log("CHOOSE OPTION")
    const option = payload?.option;
    const clientData = this.clientInfo.get(client.id);
    if (!clientData) return;

    // Se estiver no estado de PENDING_AUTH e o usuário clicar no botão de autenticação (valor "auth")
    if (clientData.state === 'PENDING_AUTH' && option === 'auth') {
      // Preenche os dados de autenticação com valores fixos
      clientData.name = "Posiflow";
      clientData.email = "posiflow@positivomais.com";
      clientData.state = 'IN_PROGRESS';
      this.clientInfo.set(client.id, clientData);
      const greeting = this.webchatMockService.getGreetingMessage(clientData.name, clientData.language);
      this.emitMessage(client, "message", greeting);
      const subject = this.webchatMockService.getInitialSubjectMessage(clientData.name, clientData.language);
      this.emitMessage(client, "message", subject);
      return;
    }
    
    // Se estiver em IN_PROGRESS, trata as opções de assunto
    if (clientData.state === 'IN_PROGRESS') {
      let optionMsg: ChatMessage;
      switch (option) {
        case "1":
          optionMsg = this.webchatMockService.getHumanSupportMessage(clientData.language);
          break;
        case "2":
          optionMsg = this.webchatMockService.getDocumentAnalysisMessage(clientData.name, clientData.language);
          break;
        case "3":
          optionMsg = this.webchatMockService.getTicketInquiryMessage(clientData.name, clientData.language);
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
      // Se não estiver em um estado esperado, reenvia a última mensagem
      const lastMsg = this.lastBotMessage.get(client.id);
      if (lastMsg) {
        this.emitMessage(client, "message", lastMsg);
      }
    }
  }

  @SubscribeMessage("finishIntendRequest")
  handleFinishIntendRequest(client: any) {
    const clientData = this.clientInfo.get(client.id);
    if (!clientData) return;
    // Atualiza o estado para tentativa de finalização
    clientData.state = 'FINISH_INTEND';
    this.clientInfo.set(client.id, clientData);
    const name = clientData.name || "";
    const confirmMsg = this.webchatMockService.getFinishIntendMessage(name, clientData.language);
    this.emitMessage(client, "finishIntendResponse", confirmMsg);
  }

  @SubscribeMessage("finishIntendConfirm")
  handleFinishConfirm(client: any, payload: any) {
    const clientData = this.clientInfo.get(client.id);
    if (!clientData) return;

    const option = payload?.option;
    if (option === '1') {
      // Usuário confirmou o encerramento
      clientData.state = 'FINESHED';
      this.clientInfo.set(client.id, clientData);
      const confirmResponse = this.webchatMockService.getFinishConfirmationMessage(option, clientData.name, clientData.language);
      if (confirmResponse) {
        this.emitMessage(client, "finishIntendResponse", confirmResponse);
      }
    } else if (option === '2') {
      // Usuário cancelou a finalização, retorna ao fluxo normal (IN_PROGRESS)
      clientData.state = 'IN_PROGRESS';
      this.clientInfo.set(client.id, clientData);
      const lastMsg = this.lastBotMessage.get(client.id);
      if (lastMsg) {
        this.emitMessage(client, "finishIntendResponse", lastMsg);
      }
    } else {
      // Opção inesperada: reenvia a última mensagem
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
  handleSendMessage(client: any, message: any) {
    console.log("SEND MESSAGE");
    const clientData = this.clientInfo.get(client.id);
    if (!clientData) return;
    
    // Se a mensagem enviada tiver status FINISH_INTEND, iniciamos o fluxo de finalização
    if (message.status === 'FINISH_INTEND') {
      clientData.state = 'FINISH_INTEND';
      this.clientInfo.set(client.id, clientData);
      const name = clientData.name || "";
      const confirmMsg = this.webchatMockService.getFinishIntendMessage(name, clientData.language);
      this.emitMessage(client, "finishIntendResponse", confirmMsg);
      return;
    }

    // Se estivermos em IN_PROGRESS e o input não for esperado, reenviamos a última mensagem
    if (clientData.state === 'IN_PROGRESS') {
      const lastMsg = this.lastBotMessage.get(client.id);
      if (lastMsg) {
        this.emitMessage(client, "message", lastMsg);
      }
    } else {
      // Para outros casos, apenas registre e reenvie a última mensagem
      this.logger.log(`Mensagem recebida de ${client.id}: ${JSON.stringify(message)}`);
      const lastMsg = this.lastBotMessage.get(client.id);
      if (lastMsg) {
        this.emitMessage(client, "message", lastMsg);
      }
    }
  }
}
