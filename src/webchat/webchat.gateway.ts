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
// import { TranslationService } from "src/translation/translation.service";
import { WebchatMockService, ChatMessage } from "src/webchat-mock/webchat-mock.service";

interface ClientInfo {
  name: string;
  language ?: string;
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
    const clientData = this.clientInfo.get(client.id);
    try {
      if (loginData && loginData.name) {
        const userName = loginData.name;
        this.clientInfo.set(client.id, { name: userName });

        // Envia saudação personalizada
        const greeting = this.webchatMockService.getGreetingMessage(userName, clientData?.language);
        this.emitMessage(client, "message", greeting);

        // Envia mensagem de boas-vindas multilíngue com botões
        const welcome = this.webchatMockService.getWelcomeMessage(clientData?.language);
        this.emitMessage(client, "message", welcome);
      } else {
        // Mensagem default para usuário não autenticado
        const defaultMsg = this.webchatMockService.getDefaultMessage(clientData?.language);
        this.emitMessage(client, "message", defaultMsg);
      }
    } catch (error) {
      this.logger.error(`Erro na autenticação do cliente ${client.id}: ${error}`);
    }
  }

  @SubscribeMessage("linkClicked")
  handleLinkClicked(client: any) {
    const userName = "Positivo";
    this.clientInfo.set(client.id, { name: userName });
    const clientData = this.clientInfo.get(client.id);

    const greeting = this.webchatMockService.getGreetingMessage(userName, clientData?.language);
    this.emitMessage(client, "message", greeting);

    const welcome = this.webchatMockService.getWelcomeMessage(clientData?.language);
    this.emitMessage(client, "message", welcome);
  }

  @SubscribeMessage("chooseLanguage")
  handleChooseLanguage(client: any, payload: any) {
    const language = payload?.language;
    const clientData = this.clientInfo.get(client.id);
    if (!clientData) return;

    clientData.language = language;
    const initialMsg = this.webchatMockService.getInitialSubjectMessage(clientData.name, clientData.language);
    this.emitMessage(client, "message", initialMsg);
  }

  @SubscribeMessage("chooseOption")
  handleChooseOption(client: any, payload: any){
    const option = payload?.option;
    const clientData = this.clientInfo.get(client.id);
    if (!clientData) return;

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
  }

  @SubscribeMessage("finishIntendRequest")
  handleFinishIntendRequest(client: any) {
    const clientData = this.clientInfo.get(client.id);
    const name = clientData ? clientData.name : "";
    const confirmMsg = this.webchatMockService.getFinishIntendMessage(name, clientData?.language);
    this.emitMessage(client, "finishIntendResponse", confirmMsg);
  }

  @SubscribeMessage("finishIntendConfirm")
  handleFinishConfirm(client: any, payload: any) {
    const clientData = this.clientInfo.get(client.id);
    if (!clientData) return;

    const option = payload?.option;
    const confirmResponse = this.webchatMockService.getFinishConfirmationMessage(option, clientData.name, clientData.language);
    console.log("confirm response", confirmResponse);
    if (confirmResponse) {
      this.emitMessage(client, "finishIntendResponse", confirmResponse);
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
  handleSendMessage(client: any, message: any) {
    this.logger.log(`Mensagem recebida de ${client.id}: ${JSON.stringify(message)}`);
    const clientData = this.clientInfo.get(client.id);;

    const responseDefault: ChatMessage = {
      text: this.webchatMockService.getAutomaticResponse(clientData?.language),
      sender: "bot",
      status: "PROGRESS",
      timestamp: new Date(),
    };

    // Envia a resposta apenas para o cliente que disparou o evento
    this.emitMessage(client, "message", responseDefault);
  }
}