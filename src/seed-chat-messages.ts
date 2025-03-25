/* eslint-disable @typescript-eslint/no-floating-promises */
import * as mongoose from 'mongoose';
import { ChatMessageSchema, IChatMessage } from '../src/webchat-mock/entities/chatMessage.entity';

// Cria o model utilizando o schema definido
const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);

// Array com todos os templates de mensagens
const messages = [
  // Mensagens de saudação (greeting)
  {
    category: 'greeting',
    lang: 'pt',
    text: 'Olá {{userName}}! Eu sou a Estella, Analista Virtual do Intuitive Service Desk da Positivo S+!',
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'greeting',
    lang: 'es',
    text: '¡Hola {{userName}}! Soy Estella, la Analista Virtual del Intuitive Service Desk de Positivo S+!',
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'greeting',
    lang: 'en',
    text: 'Hello {{userName}}! I am Estella, the Virtual Analyst of the Positivo S+ Intuitive Service Desk!',
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'greeting',
    lang: 'ro',
    text: 'Bună {{userName}}! Sunt Estella, Analistul Virtual al Service Desk-ului Intuitiv Positivo S+!',
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'greeting',
    lang: 'fr',
    text: 'Bonjour {{userName}}! Je suis Estella, l\'Analyste Virtuel du Service Desk Intuitif de Positivo S+!',
    sender: 'bot',
    status: 'PROGRESS'
  },

  // Mensagens padrão (default)
  {
    category: 'default',
    lang: 'pt',
    text: "Olá, Boa tarde! Eu sou a Estella, Analista Virtual do Intuitive Service Desk da Positivo S+! Estou aqui para esclarecer dúvidas e prestar suporte técnico. Por favor, clique no link abaixo para se autenticar: <a id='posiflow_auth_link' href='#' target='_blank'>https://www.exemplo.com/login</a>. Caso deseje reset de senha, digite #reset, para desbloqueio.",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'default',
    lang: 'es',
    text: "¡Hola, buenas tardes! Soy Estella, la Analista Virtual del Intuitive Service Desk de Positivo S+! Estoy aquí para aclarar dudas y brindar soporte técnico. Por favor, haz clic en el siguiente enlace para autenticarte: <a id='posiflow_auth_link' href='#' target='_blank'>https://www.exemplo.com/login</a>. Si deseas restablecer tu contraseña, escribe #reset, para desbloqueo.",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'default',
    lang: 'en',
    text: "Hello, good afternoon! I am Estella, the Virtual Analyst of the Positivo S+ Intuitive Service Desk! I am here to answer questions and provide technical support. Please click the link below to authenticate: <a id='posiflow_auth_link' href='#' target='_blank'>https://www.exemplo.com/login</a>. If you need a password reset, type #reset for unlock.",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'default',
    lang: 'ro',
    text: "Bună, după-amiaza bună! Sunt Estella, Analistul Virtual al Service Desk-ului Intuitiv Positivo S+! Sunt aici pentru a clarifica întrebări și a oferi suport tehnic. Te rog să faci clic pe linkul de mai jos pentru autentificare: <a id='posiflow_auth_link' href='#' target='_blank'>https://www.exemplo.com/login</a>. Dacă dorești resetarea parolei, tastează #reset pentru deblocare.",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'default',
    lang: 'fr',
    text: "Bonjour, bon après-midi! Je suis Estella, l'Analyste Virtuel du Service Desk Intuitif de Positivo S+! Je suis là pour répondre à vos questions et fournir un support technique. Veuillez cliquer sur le lien ci-dessous pour vous authentifier: <a id='posiflow_auth_link' href='#' target='_blank'>https://www.exemplo.com/login</a>. Si vous souhaitez réinitialiser votre mot de passe, tapez #reset pour déverrouiller.",
    sender: 'bot',
    status: 'PROGRESS'
  },

  // Mensagem de boas-vindas (welcome)
  {
    category: 'welcome',
    lang: 'all',
    text: "🇧🇷 Olá, escolha o idioma para conversar:\n\n🇪🇸 Hola, elige el idioma para conversar:\n\n🇺🇸 Hello, choose the language to chat:\n\n🇷🇴 Bună, alege limba pentru conversație:\n\n🇫🇷 Bonjour, choisissez la langue pour discuter:",
    sender: 'bot',
    status: 'PROGRESS',
    type: 'buttons',
    buttons: [
      { label: 'Português', value: 'pt' },
      { label: 'Español', value: 'es' },
      { label: 'English', value: 'en' },
      { label: 'Română', value: 'ro' },
      { label: 'Français', value: 'fr' }
    ],
    context: 'language'
  },

  // Mensagem de solicitação de autenticação (auth)
  {
    category: 'auth',
    lang: 'pt',
    text: "Por favor, autentique-se para continuar.",
    sender: 'bot',
    status: 'PROGRESS',
    type: 'buttons',
    buttons: [{ label: 'Autenticar', value: 'auth' }],
    context: 'auth'
  },
  {
    category: 'auth',
    lang: 'es',
    text: "Por favor, autentícate para continuar.",
    sender: 'bot',
    status: 'PROGRESS',
    type: 'buttons',
    buttons: [{ label: 'Autenticar', value: 'auth' }],
    context: 'auth'
  },
  {
    category: 'auth',
    lang: 'en',
    text: "Please authenticate to continue.",
    sender: 'bot',
    status: 'PROGRESS',
    type: 'buttons',
    buttons: [{ label: 'Authenticate', value: 'auth' }],
    context: 'auth'
  },
  {
    category: 'auth',
    lang: 'ro',
    text: "Te rog autentifică-te pentru a continua.",
    sender: 'bot',
    status: 'PROGRESS',
    type: 'buttons',
    buttons: [{ label: 'Autentificare', value: 'auth' }],
    context: 'auth'
  },
  {
    category: 'auth',
    lang: 'fr',
    text: "Veuillez vous authentifier pour continuer.",
    sender: 'bot',
    status: 'PROGRESS',
    type: 'buttons',
    buttons: [{ label: "S'authentifier", value: 'auth' }],
    context: 'auth'
  },

  // Mensagem de escolha do assunto (subject)
  {
    category: 'subject',
    lang: 'pt',
    text: "{{userName}}, sobre qual assunto você deseja tratar?",
    sender: 'bot',
    status: 'PROGRESS',
    type: 'buttons',
    buttons: [
      { label: 'Atendimento Humano', value: '1' },
      { label: 'Análise de Documentos', value: '2' },
      { label: 'Consulta de Chamados', value: '3' }
    ],
    context: 'subject'
  },
  {
    category: 'subject',
    lang: 'es',
    text: "{{userName}}, ¿sobre qué tema deseas conversar?",
    sender: 'bot',
    status: 'PROGRESS',
    type: 'buttons',
    buttons: [
      { label: 'Atención Humana', value: '1' },
      { label: 'Análisis de Documentos', value: '2' },
      { label: 'Consulta de Tickets', value: '3' }
    ],
    context: 'subject'
  },
  {
    category: 'subject',
    lang: 'en',
    text: "{{userName}}, what topic would you like to discuss?",
    sender: 'bot',
    status: 'PROGRESS',
    type: 'buttons',
    buttons: [
      { label: 'Human Support', value: '1' },
      { label: 'Document Analysis', value: '2' },
      { label: 'Ticket Inquiry', value: '3' }
    ],
    context: 'subject'
  },
  {
    category: 'subject',
    lang: 'ro',
    text: "{{userName}}, despre ce subiect dorești să discuți?",
    sender: 'bot',
    status: 'PROGRESS',
    type: 'buttons',
    buttons: [
      { label: 'Suport Uman', value: '1' },
      { label: 'Analiza Documentelor', value: '2' },
      { label: 'Interogare de Tichete', value: '3' }
    ],
    context: 'subject'
  },
  {
    category: 'subject',
    lang: 'fr',
    text: "{{userName}}, sur quel sujet souhaitez-vous discuter?",
    sender: 'bot',
    status: 'PROGRESS',
    type: 'buttons',
    buttons: [
      { label: 'Support Humain', value: '1' },
      { label: 'Analyse de Documents', value: '2' },
      { label: 'Consultation de Tickets', value: '3' }
    ],
    context: 'subject'
  },

  // Mensagem de atendimento humano (human_support)
  {
    category: 'human_support',
    lang: 'pt',
    text: "Olá! Aguarde um momento. Em breve você será atendido. Você é o 1º na fila de atendimento. Tempo médio de espera: 00h01m54s.",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'human_support',
    lang: 'es',
    text: "¡Hola! Espera un momento. Pronto serás atendido. Eres el primero en la fila de atención. Tiempo de espera estimado: 00h01m54s.",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'human_support',
    lang: 'en',
    text: "Hello! Please wait a moment. You will be attended shortly. You are first in line. Estimated wait time: 00h01m54s.",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'human_support',
    lang: 'ro',
    text: "Bună! Așteaptă un moment. Vei fi deservit în curând. Ești primul în coadă. Timpul estimat de așteptare: 00h01m54s.",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'human_support',
    lang: 'fr',
    text: "Bonjour! Veuillez patienter un instant. Vous serez servi sous peu. Vous êtes le premier de la file d'attente. Temps d'attente estimé: 00h01m54s.",
    sender: 'bot',
    status: 'PROGRESS'
  },

  // Mensagem para análise de documentos (document_analysis)
  {
    category: 'document_analysis',
    lang: 'pt',
    text: "{{userName}}, você pode enviar um documento com no máximo 5MB para que eu possa ajudar com informações específicas sobre ele.\nDica: Certifique-se de que seu documento esteja em um dos formatos suportados (PDF, DOCX, XLSX, PPTX, TXT) antes de enviá-lo.",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'document_analysis',
    lang: 'es',
    text: "{{userName}}, puedes enviar un documento de hasta 5MB para que pueda ayudarte con información específica sobre él.\nConsejo: Asegúrate de que tu documento esté en uno de los formatos soportados (PDF, DOCX, XLSX, PPTX, TXT) antes de enviarlo.",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'document_analysis',
    lang: 'en',
    text: "{{userName}}, you can send a document up to 5MB so I can help with specific information about it.\nTip: Ensure your document is in one of the supported formats (PDF, DOCX, XLSX, PPTX, TXT) before sending.",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'document_analysis',
    lang: 'ro',
    text: "{{userName}}, poți trimite un document de maximum 5MB pentru a te ajutar cu informații specifice despre acesta.\nSfat: Asigură-te că documentul tău este într-unul din formatele acceptate (PDF, DOCX, XLSX, PPTX, TXT) înainte de a-l trimite.",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'document_analysis',
    lang: 'fr',
    text: "{{userName}}, vous pouvez envoyer un document d'au maximum 5 Mo afin que je puisse vous aider avec des informations spécifiques le concernant.\nConseil : Assurez-vous que votre document soit dans l'un des formats supportés (PDF, DOCX, XLSX, PPTX, TXT) avant de l'envoyer.",
    sender: 'bot',
    status: 'PROGRESS'
  },

  // Mensagem para consulta de chamados (ticket_inquiry)
  {
    category: 'ticket_inquiry',
    lang: 'pt',
    text: "{{userName}}, você não possui chamados em aberto no momento. Te ajudo em algo mais?",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'ticket_inquiry',
    lang: 'es',
    text: "{{userName}}, no tienes tickets abiertos en este momento. Te ayudo en algo más?",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'ticket_inquiry',
    lang: 'en',
    text: "{{userName}}, you do not have any open tickets at the moment. Can I help you with something else?",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'ticket_inquiry',
    lang: 'ro',
    text: "{{userName}}, nu ai niciun tichet deschis în moment. Pot să te ajut cu altceva?",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'ticket_inquiry',
    lang: 'fr',
    text: "{{userName}}, vous n'avez aucun ticket ouvert pour le moment. Puis-je vous aider d'une autre manière ?",
    sender: 'bot',
    status: 'PROGRESS'
  },

  // Mensagem de confirmação para encerramento (finish_intend)
  {
    category: 'finish_intend',
    lang: 'pt',
    text: "DESEJA MESMO ENCERRAR O CHAT?",
    sender: 'bot',
    status: 'FINESHED_INTENDED',
    type: 'buttons',
    buttons: [
      { label: 'SIM', value: '1' },
      { label: 'NÃO', value: '2' }
    ],
    context: 'finish'
  },
  {
    category: 'finish_intend',
    lang: 'es',
    text: "¿REALMENTE DESEAS TERMINAR EL CHAT?",
    sender: 'bot',
    status: 'FINESHED_INTENDED',
    type: 'buttons',
    buttons: [
      { label: 'SÍ', value: '1' },
      { label: 'NO', value: '2' }
    ],
    context: 'finish'
  },
  {
    category: 'finish_intend',
    lang: 'en',
    text: "DO YOU REALLY WANT TO END THE CHAT?",
    sender: 'bot',
    status: 'FINESHED_INTENDED',
    type: 'buttons',
    buttons: [
      { label: 'YES', value: '1' },
      { label: 'NO', value: '2' }
    ],
    context: 'finish'
  },
  {
    category: 'finish_intend',
    lang: 'ro',
    text: "CHIAR VREI SĂ ÎNCHEI CHATUL?",
    sender: 'bot',
    status: 'FINESHED_INTENDED',
    type: 'buttons',
    buttons: [
      { label: 'DA', value: '1' },
      { label: 'NU', value: '2' }
    ],
    context: 'finish'
  },
  {
    category: 'finish_intend',
    lang: 'fr',
    text: "VOULEZ-VOUS VRAIMENT TERMINER LE CHAT?",
    sender: 'bot',
    status: 'FINESHED_INTENDED',
    type: 'buttons',
    buttons: [
      { label: 'OUI', value: '1' },
      { label: 'NON', value: '2' }
    ],
    context: 'finish'
  },

  // Mensagens de confirmação após escolha de encerramento (finish_confirmation)
  // Opção "sim" (finish_confirmation_yes)
  {
    category: 'finish_confirmation_yes',
    lang: 'pt',
    text: "Obrigado pelo seu atendimento. Para finalizar, por favor, preencha nossa pesquisa de satisfação: https://www.exemplo.com/satisfacao",
    sender: 'bot',
    status: 'FINESHED'
  },
  {
    category: 'finish_confirmation_yes',
    lang: 'es',
    text: "Gracias por tu atención. Para finalizar, por favor, completa nuestra encuesta de satisfacción: https://www.exemplo.com/satisfacao",
    sender: 'bot',
    status: 'FINESHED'
  },
  {
    category: 'finish_confirmation_yes',
    lang: 'en',
    text: "Thank you for your service. To finish, please fill out our satisfaction survey: https://www.exemplo.com/satisfacao",
    sender: 'bot',
    status: 'FINESHED'
  },
  {
    category: 'finish_confirmation_yes',
    lang: 'ro',
    text: "Mulțumim pentru asistență. Pentru a finaliza, te rugăm să completezi sondajul nostru de satisfacție: https://www.exemplo.com/satisfacao",
    sender: 'bot',
    status: 'FINESHED'
  },
  {
    category: 'finish_confirmation_yes',
    lang: 'fr',
    text: "Merci pour votre service. Pour terminer, veuillez remplir notre enquête de satisfaction : https://www.exemplo.com/satisfacao",
    sender: 'bot',
    status: 'FINESHED'
  },
  // Opção "não" (finish_confirmation_no)
  {
    category: 'finish_confirmation_no',
    lang: 'pt',
    text: "{{userName}}, sobre qual assunto você deseja tratar?\n1 - Atendimento Humano\n2 - Análise de Documentos\n3 - Consulta de Chamados",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'finish_confirmation_no',
    lang: 'es',
    text: "{{userName}}, ¿sobre qué tema deseas conversar?\n1 - Atención Humana\n2 - Análisis de Documentos\n3 - Consulta de Tickets",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'finish_confirmation_no',
    lang: 'en',
    text: "{{userName}}, what topic would you like to discuss?\n1 - Human Support\n2 - Document Analysis\n3 - Ticket Inquiry",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'finish_confirmation_no',
    lang: 'ro',
    text: "{{userName}}, despre ce subiect dorești să discuți?\n1 - Suport Uman\n2 - Analiza Documentelor\n3 - Interogare de Tichete",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'finish_confirmation_no',
    lang: 'fr',
    text: "{{userName}}, sur quel sujet souhaitez-vous discuter?\n1 - Support Humain\n2 - Analyse de Documents\n3 - Consultation de Tickets",
    sender: 'bot',
    status: 'PROGRESS'
  },

  // Mensagem de resposta automática (automatic_response)
  {
    category: 'automatic_response',
    lang: 'pt',
    text: "Olá! Isso é uma resposta automática.",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'automatic_response',
    lang: 'es',
    text: "¡Hola! Esta es una respuesta automática.",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'automatic_response',
    lang: 'en',
    text: "Hello! This is an automatic response.",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'automatic_response',
    lang: 'ro',
    text: "Bună! Acesta este un răspuns automat.",
    sender: 'bot',
    status: 'PROGRESS'
  },
  {
    category: 'automatic_response',
    lang: 'fr',
    text: "Bonjour! Ceci est une réponse automatique.",
    sender: 'bot',
    status: 'PROGRESS'
  },
];

async function seed() {
  try {
    // Substitua pela sua connection string
    await mongoose.connect('mongodb+srv://emanuelhvd:91fefbe2-e0ff-4c95-bb1d-ae9768a214cf@cluster0.5yq2j.mongodb.net/posiflow?appName=Cluster0');
    console.log('Conectado ao MongoDB');

    // Remove todas as mensagens existentes
    await ChatMessage.deleteMany({});
    console.log('Mensagens antigas removidas');

    // Insere as novas mensagens
    await ChatMessage.insertMany(messages);
    console.log('Mensagens inseridas com sucesso!');
  } catch (error) {
    console.error('Erro ao popular as mensagens:', error);
  } finally {
    mongoose.disconnect();
  }
}

seed();
