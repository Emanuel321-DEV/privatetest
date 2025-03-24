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
import { TranslationService } from "src/translation/translation.service";
import { WebchatMockService } from "src/webchat-mock/webchat-mock.service";

interface Button {
  label: string;
  value: string;
}

interface ChatMessage {
  text: string;
  sender: "bot" | "user";
  status: "FINESHED" | "PROGRESS" | "FINESHED_INTENDED";
  timestamp: Date;
  type?: string;           // ex: 'buttons'
  buttons?: Button[];      // array de botões caso o type seja 'buttons'
}

interface ClientInfo {
  name: string;
  language?: string;
}

@WebSocketGateway({ cors: { origin: 'http://localhost:4200', credentials: true } })
export class WebchatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(WebchatGateway.name);
  
  // Map para armazenar informações dos clientes (nome e idioma selecionado)
  private clientInfo: Map<string, ClientInfo> = new Map();
  // Map para armazenar a última mensagem enviada pelo bot para cada cliente
  private lastBotMessage: Map<string, ChatMessage> = new Map();

  constructor(
    private readonly webchatMockService: WebchatMockService,
    private translationService: TranslationService
  ) {}

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log("Gateway Inicializado");
  }

  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Cliente conectado: ${client.id}`);
    // Aguarda que o cliente envie a mensagem de autenticação ou clique no link
  }

  handleDisconnect(client: any) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
    // Limpa informações do cliente
    this.clientInfo.delete(client.id);
    this.lastBotMessage.delete(client.id);
  }

  /**
   * Método auxiliar para enviar mensagem traduzida caso o usuário já tenha definido seu idioma.
   */
  private async sendTranslatedMessage(client: any, event: string, chatMessage: ChatMessage): Promise<void> {
    const clientData = this.clientInfo.get(client.id);
    if (clientData?.language) {
      try {
        // Traduz o texto da mensagem
        chatMessage.text = await this.translationService.translateText(chatMessage.text, clientData.language);
        // Se houver botões, traduzir os rótulos
        if (chatMessage.buttons && chatMessage.buttons.length > 0) {
          for (const btn of chatMessage.buttons) {
            btn.label = await this.translationService.translateText(btn.label, clientData.language);
          }
        }
      } catch (error) {
        this.logger.error(`Erro na tradução para o cliente ${client.id}: ${error}`);
      }
    }
    client.emit(event, chatMessage);
    this.lastBotMessage.set(client.id, chatMessage);
  }

  /**
   * 1. Inicialização do Webchat - Verificação de autenticação do usuário
   */
  @SubscribeMessage("authenticate")
  async handleAuthentication(client: any, loginData: any): Promise<void> {
    try {
      if (loginData && loginData.name) {
        // Usuário autenticado
        const userName = loginData.name;
        this.clientInfo.set(client.id, { name: userName });
        // Mensagem de saudação personalizada
        const greeting: ChatMessage = {
          text: `Olá ${userName}! Eu sou a Estella, Analista Virtual do Intuitive Service Desk da Positivo S+!`,
          sender: "bot",
          status: "PROGRESS",
          timestamp: new Date()
        };
        await this.sendTranslatedMessage(client, "message", greeting);
        // Em seguida, envia a mensagem de boas-vindas multilíngue com botões de idiomas
        await this.sendWelcomeMessage(client, userName);
      } else {
        // Usuário não autenticado
        const defaultMsg: ChatMessage = {
          text: "Olá, Boa tarde! Eu sou a Estella, Analista Virtual do Intuitive Service Desk da Positivo S+! " +
                "Estou aqui para esclarecer dúvidas e prestar suporte técnico. " +
                "Por favor, clique no link abaixo para se autenticar: " +
                "<a id='posiflow_auth_link' href='#' target='_blank'>https://www.exemplo.com/login</a>. " +
                "Caso deseje reset de senha, digite #reset, para desbloqueio.",
          sender: "bot",
          status: "PROGRESS",
          timestamp: new Date()
        };
        await this.sendTranslatedMessage(client, "message", defaultMsg);
        // Aguarda o clique no link (evento 'linkClicked') para considerar o nome "Positivo"
      }
    } catch (error) {
      this.logger.error(`Erro na autenticação do cliente ${client.id}: ${error}`);
    }
  }

  /**
   * Evento disparado quando o usuário clica no link de autenticação.
   * Assume que o usuário se chama "Positivo" e envia a mensagem de boas-vindas.
   */
  @SubscribeMessage("linkClicked")
  async handleLinkClicked(client: any): Promise<void> {
    const userName = "Positivo";
    this.clientInfo.set(client.id, { name: userName });
    // Envia saudação simples antes da mensagem de boas-vindas
    const greeting: ChatMessage = {
      text: `Olá ${userName}! Eu sou a Estella, Analista Virtual do Intuitive Service Desk da Positivo S+!`,
      sender: "bot",
      status: "PROGRESS",
      timestamp: new Date()
    };
    await this.sendTranslatedMessage(client, "message", greeting);
    // Envia a mensagem de boas-vindas multilíngue com botões
    await this.sendWelcomeMessage(client, userName);
  }

  /**
   * Envia mensagem de boas-vindas multilíngue com opções de idioma via botões.
   */
  private async sendWelcomeMessage(client: any, userName: string): Promise<void> {
    const welcome: ChatMessage = {
      type: 'buttons',
      text: "Olá, escolha o idioma para conversar:\n" +
            "Hola, elige el idioma para conversar:\n" +
            "Hello, choose the language to chat:\n" +
            "Bună, alege limba pentru conversație:\n" +
            "Bonjour, choisissez la langue pour discuter:",
      buttons: [
        { label: 'Português', value: 'pt' },
        { label: 'Español', value: 'es' },
        { label: 'English', value: 'en' },
        { label: 'Română', value: 'ro' },
        { label: 'Français', value: 'fr' },
        // { label: 'Outro', value: 'ot' },
      ],
      sender: "bot",
      status: "PROGRESS",
      timestamp: new Date()
    };
    await this.sendTranslatedMessage(client, "message", welcome);
  }

  /**
   * 3. Escolha do Idioma e Mensagem Inicial
   * Define o idioma escolhido e exibe as opções de assunto via botões.
   */
  @SubscribeMessage("chooseLanguage")
  async handleChooseLanguage(client: any, payload: any): Promise<void> {
    const language = payload?.language; // Ex: "pt", "es", "en", "ro" ou "fr"
    const clientData = this.clientInfo.get(client.id);
    if (!clientData) return;
    clientData.language = language;
    // Envia mensagem inicial no idioma escolhido com botões para os assuntos
    const initialMsg: ChatMessage = {
      type: 'buttons',
      text: `${clientData.name}, sobre qual assunto você deseja tratar?`,
      buttons: [
        { label: 'Atendimento Humano', value: '1' },
        { label: 'Análise de Documentos', value: '2' },
        { label: 'Consulta de Chamados', value: '3' },
      ],
      sender: "bot",
      status: "PROGRESS",
      timestamp: new Date()
    };
    await this.sendTranslatedMessage(client, "message", initialMsg);
  }

  /**
   * 3. Escolha do Assunto
   * Trata a opção escolhida pelo usuário.
   */
  @SubscribeMessage("chooseOption")
  async handleChooseOption(client: any, payload: any): Promise<void> {
    const option = payload?.option;
    const clientData = this.clientInfo.get(client.id);
    if (!clientData) return;
    let responseText: string;
    console.log('THIS IS A WEBSOCKET REQUEST', option);
    switch (option) {
      case "1": // Atendimento Humano
        responseText = "Olá! Aguarde um momento. Em breve você será atendido. " +
                       "Você é o 1º na fila de atendimento. Tempo médio de espera: 00h01m54s.";
        break;
      case "2": // Análise de Documentos
        responseText = `${clientData.name}, você pode enviar um documento com no máximo 5MB para que eu possa ajudar com informações específicas sobre ele.\n` +
                       `Dica: Certifique-se de que seu documento esteja em um dos formatos suportados (PDF, DOCX, XLSX, PPTX, TXT) antes de enviá-lo.`;
        break;
      case "3": // Consulta de Chamados
        responseText = `${clientData.name}, VOCÊ NÃO POSSUI CHAMADOS EM ABERTO NO MOMENTO. TE AJUDO EM ALGO MAIS? 1 - SIM, 2 - NÃO.`;
        break;
      default:
        {
          const lastMsg = this.lastBotMessage.get(client.id);
          if (lastMsg) {
            await this.sendTranslatedMessage(client, "message", lastMsg);
          }
          return;
        }
    }
    const optionMsg: ChatMessage = {
      text: responseText,
      sender: "bot",
      status: "PROGRESS",
      timestamp: new Date()
    };
    await this.sendTranslatedMessage(client, "message", optionMsg);
  }

  /**
   * 4. Encerramento do Chat
   * Evento disparado quando o usuário solicita o encerramento.
   */
  @SubscribeMessage("finishIntendRequest")
  async handleFinishIntendRequest(client: any, message: any): Promise<void> {
    const clientData = this.clientInfo.get(client.id);
    const name = clientData ? clientData.name : "";
    const confirmMsg: ChatMessage = {
      type: 'buttons',
      text: `${name}, DESEJA MESMO ENCERRAR O CHAT?`,
      buttons: [
        { label: 'SIM', value: '1' },
        { label: 'NÃO', value: '2' }
      ],
      sender: "bot",
      status: "FINESHED_INTENDED",
      timestamp: new Date()
    };
    // Envia apenas para o cliente que solicitou
    await this.sendTranslatedMessage(client, "finishIntendResponse", confirmMsg);
  }

  /**
   * Evento para confirmação do encerramento.
   * Se o usuário confirmar (opção "1"), envia mensagem com link para pesquisa de satisfação.
   * Se escolher "2", retorna à mensagem inicial (assunto).
   */
  @SubscribeMessage("finishIntendConfirm")
  async handleFinishConfirm(client: any, payload: any): Promise<void> {
    const clientData = this.clientInfo.get(client.id);
    if (!clientData) return;
  
    const option = payload?.option;
    let responseText: string;
  
    if (option === "1") {
      responseText = `Obrigado pelo seu atendimento. Para finalizar, por favor, preencha nossa pesquisa de satisfação: https://www.exemplo.com/satisfacao`;
  
      const confirmResponse: ChatMessage = {
        text: responseText,
        sender: "bot",
        status: "FINESHED",
        timestamp: new Date()
      };
  
      // Envia a mensagem normal (pode passar pela função que já existe)
      await this.sendTranslatedMessage(client, "finishIntendResponse", confirmResponse);
  
    } else if (option === "2") {
      responseText = `${clientData.name}, sobre qual assunto você deseja tratar?\n` +
                     `1 - Atendimento Humano\n` +
                     `2 - Análise de Documentos\n` +
                     `3 - Consulta de Chamados`;
  
      const confirmResponse: ChatMessage = {
        text: responseText,
        sender: "bot",
        status: "PROGRESS",
        timestamp: new Date()
      };
      await this.sendTranslatedMessage(client, "finishIntendResponse", confirmResponse);
    } else {
      const lastMsg = this.lastBotMessage.get(client.id);
      if (lastMsg) {
        await this.sendTranslatedMessage(client, "finishIntendResponse", lastMsg);
      }
    }
  }
  

  /**
   * 2. Mensagem de Boas-Vindas (caso o usuário não esteja autenticado inicialmente)
   * Pode ser chamada para relembrar as opções caso uma entrada não seja reconhecida.
   */
  @SubscribeMessage("fallback")
  async handleFallback(client: any): Promise<void> {
    const lastMsg = this.lastBotMessage.get(client.id);
    if (lastMsg) {
      await this.sendTranslatedMessage(client, "message", lastMsg);
    }
  }

  /**
   * 5. Tratamento de Entradas Não Reconhecidas
   * Caso a mensagem do cliente não corresponda a nenhum comando esperado, reenvia a última mensagem do bot.
   */
  @SubscribeMessage("unrecognized")
  async handleUnrecognized(client: any, payload: any): Promise<void> {
    const lastMsg = this.lastBotMessage.get(client.id);
    if (lastMsg) {
      await this.sendTranslatedMessage(client, "message", lastMsg);
    }
  }

  /**
   * Handler para mensagens de chat gerais (resposta automática)
   */
  @SubscribeMessage("sendMessage")
  async handleSendMessage(client: any, message: any): Promise<void> {
    this.logger.log(`Mensagem recebida de ${client.id}: ${JSON.stringify(message)}`);
    // Exemplo de resposta automática para mensagens gerais
    const respostaAutomatica: ChatMessage = {
      text: "Olá! Isso é uma resposta automática.",
      sender: "bot",
      status: "PROGRESS",
      timestamp: new Date(),
    };
    // Envia a resposta para cada cliente conectado individualmente
    for (const [id, socket] of this.io.sockets.sockets) {
      await this.sendTranslatedMessage(socket, "message", respostaAutomatica);
    }
  }
}
