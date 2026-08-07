import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';
import { ClientMessageRequest, ClientMessageResponse } from '../models/client-message';
import { ClientMessageService } from './client-message-service';

const response: ClientMessageResponse = {
  id: 'message-id', email: 'cliente@example.com', assunto: 'Ajuda', descricao: 'Mensagem',
  status: 'PENDENTE', tentativas: 0, criadoEm: '2026-08-07T10:00:00',
  publicadoEm: null, processadoEm: null,
};

describe('ClientMessageService', () => {
  let service: ClientMessageService;
  let http: HttpTestingController;
  const endpoint = `${environment.apiUrl}/client-messages`;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ClientMessageService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('sends the public unidirectional message payload', () => {
    const request: ClientMessageRequest = {
      email: 'cliente@example.com', assunto: 'Ajuda', descricao: 'Mensagem',
    };
    service.send(request).subscribe(value => expect(value).toEqual(response));

    const pending = http.expectOne(endpoint);
    expect(pending.request.method).toBe('POST');
    expect(pending.request.body).toEqual(request);
    pending.flush(response);
  });

  it('uses only page and size when listing messages', () => {
    service.findAll(2, 20).subscribe();

    const pending = http.expectOne(request => request.url === endpoint);
    expect(pending.request.method).toBe('GET');
    expect(pending.request.params.keys().sort()).toEqual(['page', 'size']);
    expect(pending.request.params.get('page')).toBe('2');
    expect(pending.request.params.get('size')).toBe('20');
    pending.flush({ content: [], totalElements: 0, totalPages: 0, size: 20, number: 2,
      numberOfElements: 0, first: false, last: true, empty: true });
  });

  it('retries a failed message through the supported endpoint', () => {
    service.retry('message-id').subscribe(value => expect(value).toEqual(response));

    const pending = http.expectOne(`${endpoint}/message-id/retry`);
    expect(pending.request.method).toBe('POST');
    expect(pending.request.body).toBeNull();
    pending.flush(response);
  });
});
