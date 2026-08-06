import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { of } from 'rxjs';

import {
  ConversationDetailResponse,
  ConversationMessageRequest,
  ConversationSummaryResponse,
  PageResponse,
} from '../../models/client-message';
import { ClientMessageService } from '../../service/client-message-service';
import { MessagesAdmin } from './messages-admin';

const summary: ConversationSummaryResponse = {
  id: 'conversation-id', email: 'cliente@example.com', assunto: 'Informações',
  clienteAutenticado: false, estado: 'AGUARDANDO_ADMIN', estadoTecnico: 'PROCESSADO',
  totalMensagens: 1, naoLidas: 1, criadoEm: '2026-08-06T08:00:00',
  ultimaInteracaoEm: '2026-08-06T08:00:00',
};

const detail: ConversationDetailResponse = {
  ...summary, encerradoEm: null,
  mensagens: [{ id: 'message-id', conteudo: 'Preciso de informações.', autorTipo: 'CLIENTE_VISITANTE',
    autorId: null, autorNome: 'Cliente', notificacaoStatus: 'ENVIADA', criadoEm: summary.criadoEm }],
};

interface MessagesAdminHarness {
  messages(): ConversationSummaryResponse[];
  selected(): ConversationDetailResponse | null;
  replyForm: FormGroup;
  open(message: ConversationSummaryResponse): void;
  reply(): void;
}

class ClientMessageServiceStub {
  replies: Array<{ id: string; request: ConversationMessageRequest }> = [];

  findAll() {
    const page: PageResponse<ConversationSummaryResponse> = {
      content: [summary], totalElements: 1, totalPages: 1, size: 10, number: 0,
      numberOfElements: 1, first: true, last: true, empty: false,
    };
    return of(page);
  }

  findOne() { return of(detail); }

  reply(id: string, request: ConversationMessageRequest) {
    this.replies.push({ id, request });
    return of({ id: 'reply-id', conteudo: request.conteudo, autorTipo: 'ADMINSTRADOR' as const,
      autorId: 'admin-id', autorNome: 'Admin', notificacaoStatus: 'PENDENTE' as const,
      criadoEm: '2026-08-06T09:00:00' });
  }
}

describe('MessagesAdmin', () => {
  let fixture: ComponentFixture<MessagesAdmin>;
  let component: MessagesAdminHarness;
  let service: ClientMessageServiceStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesAdmin],
      providers: [{ provide: ClientMessageService, useClass: ClientMessageServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(MessagesAdmin);
    component = fixture.componentInstance as unknown as MessagesAdminHarness;
    service = TestBed.inject(ClientMessageService) as unknown as ClientMessageServiceStub;
    fixture.detectChanges();
  });

  it('loads the first page', () => {
    expect(component.messages()).toEqual([summary]);
  });

  it('opens a conversation and sends a reply with the real API contract', () => {
    component.open(summary);
    component.replyForm.setValue({ conteudo: 'Teremos todo o gosto em ajudar.' });
    component.reply();

    expect(service.replies).toEqual([{
      id: 'conversation-id', request: { conteudo: 'Teremos todo o gosto em ajudar.' },
    }]);
    expect(component.selected()?.estado).toBe('RESPONDIDA');
  });
});
