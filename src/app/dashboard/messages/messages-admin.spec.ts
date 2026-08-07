import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ClientMessageResponse, PageResponse } from '../../models/client-message';
import { ClientMessageService } from '../../service/client-message-service';
import { MessagesAdmin } from './messages-admin';

const message: ClientMessageResponse = {
  id: 'message-id',
  email: 'cliente@example.com',
  assunto: 'Informações',
  descricao: 'Preciso de informações.',
  status: 'FALHADO',
  tentativas: 3,
  criadoEm: '2026-08-07T10:00:00',
  publicadoEm: '2026-08-07T10:01:00',
  processadoEm: null,
};

interface MessagesAdminHarness {
  messages(): ClientMessageResponse[];
  selected(): ClientMessageResponse | null;
  page(): number;
  open(item: ClientMessageResponse): void;
  retry(item: ClientMessageResponse): void;
}

class ClientMessageServiceStub {
  retriedIds: string[] = [];

  findAll() {
    const page: PageResponse<ClientMessageResponse> = {
      content: [message], totalElements: 1, totalPages: 1, size: 10, number: 0,
      numberOfElements: 1, first: true, last: true, empty: false,
    };
    return of(page);
  }

  retry(id: string) {
    this.retriedIds.push(id);
    return of({ ...message, status: 'PENDENTE' as const, tentativas: 0 });
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

  it('loads the unidirectional messages page', () => {
    expect(component.messages()).toEqual([message]);
    expect(component.page()).toBe(0);
  });

  it('opens details locally without making an additional request', () => {
    component.open(message);
    expect(component.selected()).toEqual(message);
  });

  it('retries a failed message using the backend contract', () => {
    component.retry(message);
    expect(service.retriedIds).toEqual(['message-id']);
    expect(component.messages()[0].status).toBe('PENDENTE');
    expect(component.messages()[0].tentativas).toBe(0);
  });
});
