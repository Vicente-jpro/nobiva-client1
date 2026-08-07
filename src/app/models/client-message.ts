export type MessageStatus = 'PENDENTE' | 'PUBLICADO' | 'PROCESSADO' | 'FALHADO';

export interface ClientMessageRequest {
  email: string;
  assunto: string;
  descricao: string;
}

export interface ClientMessageResponse {
  id: string;
  email: string;
  assunto: string;
  descricao: string;
  status: MessageStatus;
  tentativas: number;
  criadoEm: string;
  publicadoEm: string | null;
  processadoEm: string | null;
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
