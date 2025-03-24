/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';

export interface ChatMessage {
  text: string;
  sender: 'bot' | 'user';
  status: 'FINESHED' | 'PROGRESS' | 'FINESHED_INTENDED';
  timestamp: Date;
  type?: string;
  buttons?: { label: string; value: string; }[];
}

@Injectable()
export class WebchatMockService {

  // Mensagem de saudação
  getGreetingMessage(userName: string, lang: string | undefined): ChatMessage {
    return {
      text: this.getGreetingMessageLanguage(userName, lang),
      sender: 'bot',
      status: 'PROGRESS',
      timestamp: new Date(),
    };
  }

  private getGreetingMessageLanguage(userName: string, lang: string | undefined): string {
    switch(lang) {
      case 'es':
        return `¡Hola ${userName}! Soy Estella, la Analista Virtual del Intuitive Service Desk de Positivo S+!`;
      case 'en':
        return `Hello ${userName}! I am Estella, the Virtual Analyst of the Positivo S+ Intuitive Service Desk!`;
      case 'ro':
        return `Bună ${userName}! Sunt Estella, Analistul Virtual al Service Desk-ului Intuitiv Positivo S+!`;
      case 'fr':
        return `Bonjour ${userName}! Je suis Estella, l'Analyste Virtuel du Service Desk Intuitif de Positivo S+!`;
      default:
        return `Olá ${userName}! Eu sou a Estella, Analista Virtual do Intuitive Service Desk da Positivo S+!`;
    }
  }

  // Mensagem padrão para usuário não autenticado
  getDefaultMessage(lang: string | undefined): ChatMessage {
    return {
      text: this.getDefaultMessageLanguage(lang),
      sender: 'bot',
      status: 'PROGRESS',
      timestamp: new Date(),
    };
  }

  private getDefaultMessageLanguage(lang: string | undefined): string {
    switch(lang) {
      case 'es':
        return "¡Hola, buenas tardes! Soy Estella, la Analista Virtual del Intuitive Service Desk de Positivo S+! Estoy aquí para aclarar dudas y brindar soporte técnico. Por favor, haz clic en el siguiente enlace para autenticarte: <a id='posiflow_auth_link' href='#' target='_blank'>https://www.exemplo.com/login</a>. Si deseas restablecer tu contraseña, escribe #reset, para desbloqueo.";
      case 'en':
        return "Hello, good afternoon! I am Estella, the Virtual Analyst of the Positivo S+ Intuitive Service Desk! I am here to answer questions and provide technical support. Please click the link below to authenticate: <a id='posiflow_auth_link' href='#' target='_blank'>https://www.exemplo.com/login</a>. If you need a password reset, type #reset for unlock.";
      case 'ro':
        return "Bună, după-amiaza bună! Sunt Estella, Analistul Virtual al Service Desk-ului Intuitiv Positivo S+! Sunt aici pentru a clarifica întrebări și a oferi suport tehnic. Te rog să faci clic pe linkul de mai jos pentru autentificare: <a id='posiflow_auth_link' href='#' target='_blank'>https://www.exemplo.com/login</a>. Dacă dorești resetarea parolei, tastează #reset pentru deblocare.";
      case 'fr':
        return "Bonjour, bon après-midi! Je suis Estella, l'Analyste Virtuel du Service Desk Intuitif de Positivo S+! Je suis là pour répondre à vos questions et fournir un support technique. Veuillez cliquer sur le lien ci-dessous pour vous authentifier: <a id='posiflow_auth_link' href='#' target='_blank'>https://www.exemplo.com/login</a>. Si vous souhaitez réinitialiser votre mot de passe, tapez #reset pour déverrouiller.";
      default:
        return "Olá, Boa tarde! Eu sou a Estella, Analista Virtual do Intuitive Service Desk da Positivo S+! Estou aqui para esclarecer dúvidas e prestar suporte técnico. Por favor, clique no link abaixo para se autenticar: <a id='posiflow_auth_link' href='#' target='_blank'>https://www.exemplo.com/login</a>. Caso deseje reset de senha, digite #reset, para desbloqueio.";
    }
  }

  // Mensagem de boas-vindas com escolha de idioma
  getWelcomeMessage(lang: string | undefined): ChatMessage {
    return {
      text: this.getWelcomeMessageLanguages(),
      sender: 'bot',
      status: 'PROGRESS',
      timestamp: new Date(),
      type: 'buttons',
      buttons: this.getLanguageButtons()
    };
  }

  private getWelcomeMessageLanguages(): string {
    return (
      "🇧🇷 Olá, escolha o idioma para conversar:\n\n" +
      "🇪🇸 Hola, elige el idioma para conversar:\n\n" +
      "🇺🇸 Hello, choose the language to chat:\n\n" +
      "🇷🇴 Bună, alege limba pentru conversație:\n\n" +
      "🇫🇷 Bonjour, choisissez la langue pour discuter:"
    );
  }
  
  

  private getLanguageButtons(): { label: string; value: string; }[] {
    // Os rótulos permanecem fixos conforme o idioma representado pelo botão
    return [
      { label: this.getButtonLabel('Portuguese'), value: 'pt' },
      { label: this.getButtonLabel('Spanish'), value: 'es' },
      { label: this.getButtonLabel('English'), value: 'en' },
      { label: this.getButtonLabel('Romanian'), value: 'ro' },
      { label: this.getButtonLabel('French'), value: 'fr' },
    ];
  }
  
  private getButtonLabel(base: string): string {
    const labels = {
      Portuguese: 'Português',
      Spanish: 'Español',
      English: 'English',
      Romanian: 'Română',
      French: 'Français',
    };
  
    return labels[base];
  }

  // Mensagem com escolha do assunto
  getInitialSubjectMessage(userName: string, lang: string | undefined): ChatMessage {
    return {
      text: this.getInitialSubjectMessageLanguage(userName, lang),
      sender: 'bot',
      status: 'PROGRESS',
      timestamp: new Date(),
      type: 'buttons',
      buttons: this.getSubjectButtons(userName, lang)
    };
  }

  private getInitialSubjectMessageLanguage(userName: string, lang: string | undefined): string {
    switch(lang) {
      case 'es':
        return `${userName}, ¿sobre qué tema deseas conversar?`;
      case 'en':
        return `${userName}, what topic would you like to discuss?`;
      case 'ro':
        return `${userName}, despre ce subiect dorești să discuți?`;
      case 'fr':
        return `${userName}, sur quel sujet souhaitez-vous discuter?`;
      default:
        return `${userName}, sobre qual assunto você deseja tratar?`;
    }
  }

  private getSubjectButtons(userName: string, lang: string | undefined): { label: string; value: string; }[] {
    return [
      { label: this.getSubjectLabel('Human Support', lang), value: '1' },
      { label: this.getSubjectLabel('Document Analysis', lang), value: '2' },
      { label: this.getSubjectLabel('Ticket Inquiry', lang), value: '3' },
    ];
  }

  private getSubjectLabel(base: string, lang: string | undefined): string {
    const labels = {
      'Human Support': {
        pt: 'Atendimento Humano',
        es: 'Atención Humana',
        en: 'Human Support',
        ro: 'Suport Uman',
        fr: 'Support Humain'
      },
      'Document Analysis': {
        pt: 'Análise de Documentos',
        es: 'Análisis de Documentos',
        en: 'Document Analysis',
        ro: 'Analiza Documentelor',
        fr: 'Analyse de Documents'
      },
      'Ticket Inquiry': {
        pt: 'Consulta de Chamados',
        es: 'Consulta de Tickets',
        en: 'Ticket Inquiry',
        ro: 'Interogare de Tichete',
        fr: 'Consultation de Tickets'
      },
    };
    return labels[base][lang] || labels[base].pt;
  }

  // Mensagem de atendimento humano
  getHumanSupportMessage(lang: string | undefined): ChatMessage {
    return {
      text: this.getHumanSupportMessageLanguage(lang),
      sender: 'bot',
      status: 'PROGRESS',
      timestamp: new Date(),
    };
  }

  private getHumanSupportMessageLanguage(lang: string | undefined): string {
    switch(lang) {
      case 'es':
        return "¡Hola! Espera un momento. Pronto serás atendido. Eres el primero en la fila de atención. Tiempo de espera estimado: 00h01m54s.";
      case 'en':
        return "Hello! Please wait a moment. You will be attended shortly. You are first in line. Estimated wait time: 00h01m54s.";
      case 'ro':
        return "Bună! Așteaptă un moment. Vei fi deservit în curând. Ești primul în coadă. Timpul estimat de așteptare: 00h01m54s.";
      case 'fr':
        return "Bonjour! Veuillez patienter un instant. Vous serez servi sous peu. Vous êtes le premier de la file d'attente. Temps d'attente estimé: 00h01m54s.";
      default:
        return "Olá! Aguarde um momento. Em breve você será atendido. Você é o 1º na fila de atendimento. Tempo médio de espera: 00h01m54s.";
    }
  }

  // Mensagem para análise de documentos
  getDocumentAnalysisMessage(userName: string, lang: string | undefined): ChatMessage {
    return {
      text: this.getDocumentAnalysisMessageLanguage(userName, lang),
      sender: 'bot',
      status: 'PROGRESS',
      timestamp: new Date(),
    };
  }

  private getDocumentAnalysisMessageLanguage(userName: string, lang: string | undefined): string {
    switch(lang) {
      case 'es':
        return `${userName}, puedes enviar un documento de hasta 5MB para que pueda ayudarte con información específica sobre él.\nConsejo: Asegúrate de que tu documento esté en uno de los formatos soportados (PDF, DOCX, XLSX, PPTX, TXT) antes de enviarlo.`;
      case 'en':
        return `${userName}, you can send a document up to 5MB so I can help with specific information about it.\nTip: Ensure your document is in one of the supported formats (PDF, DOCX, XLSX, PPTX, TXT) before sending.`;
      case 'ro':
        return `${userName}, poți trimite un document de maximum 5MB pentru a te ajuta cu informații specifice despre acesta.\nSfat: Asigură-te că documentul tău este într-unul din formatele acceptate (PDF, DOCX, XLSX, PPTX, TXT) înainte de a-l trimite.`;
      case 'fr':
        return `${userName}, vous pouvez envoyer un document d'au maximum 5 Mo afin que je puisse vous aider avec des informations spécifiques le concernant.\nConseil : Assurez-vous que votre document soit dans l'un des formats supportés (PDF, DOCX, XLSX, PPTX, TXT) avant de l'envoyer.`;
      default:
        return `${userName}, você pode enviar um documento com no máximo 5MB para que eu possa ajudar com informações específicas sobre ele.\nDica: Certifique-se de que seu documento esteja em um dos formatos suportados (PDF, DOCX, XLSX, PPTX, TXT) antes de enviá-lo.`;
    }
  }

  // Mensagem para consulta de chamados
  getTicketInquiryMessage(userName: string, lang: string | undefined): ChatMessage {
    return {
      text: this.getTicketInquiryMessageLanguage(userName, lang),
      sender: 'bot',
      status: 'PROGRESS',
      timestamp: new Date(),
    };
  }

  private getTicketInquiryMessageLanguage(userName: string, lang: string | undefined): string {
    switch(lang) {
      case 'es':
        return `${userName}, NO TIENES TICKETS ABIERTOS EN ESTE MOMENTO. ¿TE AYUDO EN ALGO MÁS? 1 - SÍ, 2 - NO.`;
      case 'en':
        return `${userName}, YOU DO NOT HAVE ANY OPEN TICKETS AT THE MOMENT. CAN I HELP YOU WITH SOMETHING ELSE? 1 - YES, 2 - NO.`;
      case 'ro':
        return `${userName}, NU AI NICIUN TICHET DESCHIS ÎN MOMENT. POT SĂ TE AJUT CU ALTCEVA? 1 - DA, 2 - NU.`;
      case 'fr':
        return `${userName}, VOUS N'AVEZ AUCUN TICKET OUVERT POUR LE MOMENT. PUIS-JE VOUS AIDER D'UNE AUTRE MANIÈRE ? 1 - OUI, 2 - NON.`;
      default:
        return `${userName}, VOCÊ NÃO POSSUI CHAMADOS EM ABERTO NO MOMENTO. TE AJUDO EM ALGO MAIS? 1 - SIM, 2 - NÃO.`;
    }
  }

  // Mensagem de confirmação para encerramento do chat
  getFinishIntendMessage(userName: string, lang: string | undefined): ChatMessage {
    return {
      text: this.getFinishIntendMessageLanguage(userName, lang),
      sender: 'bot',
      status: 'FINESHED_INTENDED',
      timestamp: new Date(),
      type: 'buttons',
      buttons: this.getFinishIntendButtons(lang)
    };
  }

  private getFinishIntendMessageLanguage(userName: string, lang: string | undefined): string {
    switch(lang) {
      case 'es':
        return `${userName}, ¿REALMENTE DESEAS TERMINAR EL CHAT?`;
      case 'en':
        return `${userName}, DO YOU REALLY WANT TO END THE CHAT?`;
      case 'ro':
        return `${userName}, CHIAR VREI SĂ ÎNCHEI CHATUL?`;
      case 'fr':
        return `${userName}, VOULEZ-VOUS VRAIMENT TERMINER LE CHAT?`;
      default:
        return `${userName}, DESEJA MESMO ENCERRAR O CHAT?`;
    }
  }

  private getFinishIntendButtons(lang: string | undefined): { label: string; value: string; }[] {
    return [
      { label: this.getFinishButtonLabel('Yes', lang), value: '1' },
      { label: this.getFinishButtonLabel('No', lang), value: '2' },
    ];
  }

  private getFinishButtonLabel(base: string, lang: string | undefined): string {
    const labels = {
      'Yes': {
        pt: 'SIM',
        es: 'SÍ',
        en: 'YES',
        ro: 'DA',
        fr: 'OUI'
      },
      'No': {
        pt: 'NÃO',
        es: 'NO',
        en: 'NO',
        ro: 'NU',
        fr: 'NON'
      }
    };
    return labels[base][lang] || labels[base].pt;
  }

  // Mensagem de confirmação após escolha de encerramento
  getFinishConfirmationMessage(option: string, userName: string, lang: string | undefined): ChatMessage | null {
    if (option === '1') {
      return {
        text: this.getFinishConfirmationMessageLanguage(option, userName, lang),
        sender: 'bot',
        status: 'FINESHED',
        timestamp: new Date(),
      };
    } else if (option === '2') {
      return {
        text: this.getFinishConfirmationMessageLanguage(option, userName, lang),
        sender: 'bot',
        status: 'PROGRESS',
        timestamp: new Date(),
      };
    }
    return null;
  }

  private getFinishConfirmationMessageLanguage(option: string, userName: string, lang: string | undefined): string {
    if (option === '1') {
      switch(lang) {
        case 'es':
          return "Gracias por tu atención. Para finalizar, por favor, completa nuestra encuesta de satisfacción: https://www.exemplo.com/satisfacao";
        case 'en':
          return "Thank you for your service. To finish, please fill out our satisfaction survey: https://www.exemplo.com/satisfacao";
        case 'ro':
          return "Mulțumim pentru asistență. Pentru a finaliza, te rugăm să completezi sondajul nostru de satisfacție: https://www.exemplo.com/satisfacao";
        case 'fr':
          return "Merci pour votre service. Pour terminer, veuillez remplir notre enquête de satisfaction : https://www.exemplo.com/satisfacao";
        default:
          return "Obrigado pelo seu atendimento. Para finalizar, por favor, preencha nossa pesquisa de satisfação: https://www.exemplo.com/satisfacao";
      }
    } else { 
      switch(lang) {
        case 'es':
          return `${userName}, ¿sobre qué tema deseas conversar?\n1 - Atención Humana\n2 - Análisis de Documentos\n3 - Consulta de Tickets`;
        case 'en':
          return `${userName}, what topic would you like to discuss?\n1 - Human Support\n2 - Document Analysis\n3 - Ticket Inquiry`;
        case 'ro':
          return `${userName}, despre ce subiect dorești să discuți?\n1 - Suport Uman\n2 - Analiza Documentelor\n3 - Interogare de Tichete`;
        case 'fr':
          return `${userName}, sur quel sujet souhaitez-vous discuter?\n1 - Support Humain\n2 - Analyse de Documents\n3 - Consultation de Tickets`;
        default:
          return `${userName}, sobre qual assunto você deseja tratar?\n1 - Atendimento Humano\n2 - Análise de Documentos\n3 - Consulta de Chamados`;
      }
    }
  }

  getAutomaticResponse(lang?: string): string {
    const messages: Record<string, string> = {
      pt: "Olá! Isso é uma resposta automática.",
      en: "Hello! This is an automatic response.",
      es: "¡Hola! Esta es una respuesta automática.",
      fr: "Bonjour! Ceci est une réponse automatique.",
      ro: "Bună! Acesta este un răspuns automat."
    };
  
    return messages[lang ?? "pt"] ?? messages.pt;
  }
}
