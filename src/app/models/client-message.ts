export type ConversationStatus = 'ABERTA' | 'RESPONDIDA' | 'AGUARDANDO_ADMIN' | 'ENCERRADA';
export type MessageStatus = 'PENDENTE' | 'PUBLICADO' | 'PROCESSADO' | 'FALHADO';
export type ConversationAuthorType =
  | 'CLIENTE_AUTENTICADO'
  | 'CLIENTE_VISITANTE'
  | 'ADMINSTRADOR'
  | 'SUPER_ADMINSTRADOR';
export type NotificationStatus = 'PENDENTE' | 'ENVIADA' | 'FALHADA';

export interface ClientMessageRequest {
  email: string;
  assunto: string;
  descricao: string;
}

export interface PublicConversationCreatedResponse {
  id: string;
  mensagem: string;
}

export interface ConversationSummaryResponse {
  id: string;
  email: string;
  assunto: string;
  clienteAutenticado: boolean;
  estado: ConversationStatus;
  estadoTecnico: MessageStatus;
  totalMensagens: number;
  naoLidas: number;
  criadoEm: string;
  ultimaInteracaoEm: string;
}

export interface ConversationMessageResponse {
  id: string;
  conteudo: string;
  autorTipo: ConversationAuthorType;
  autorId: string | null;
  autorNome: string;
  notificacaoStatus: NotificationStatus;
  criadoEm: string;
}

export interface ConversationDetailResponse {
  id: string;
  email: string;
  assunto: string;
  clienteAutenticado: boolean;
  estado: ConversationStatus;
  estadoTecnico: MessageStatus;
  criadoEm: string;
  ultimaInteracaoEm: string;
  encerradoEm: string | null;
  mensagens: ConversationMessageResponse[];
}

export interface ConversationMessageRequest {
  conteudo: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ConversationFilters {
  estado?: ConversationStatus;
  email?: string;
}
