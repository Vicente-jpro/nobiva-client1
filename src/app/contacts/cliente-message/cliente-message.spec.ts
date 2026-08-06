import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { of } from 'rxjs';

import { ClientMessageRequest } from '../../models/client-message';
import { ClientMessageService } from '../../service/client-message-service';
import { ClienteMessage } from './cliente-message';

interface ClienteMessageHarness {
  messageForm: FormGroup;
  send(): void;
  state(): string;
  feedback(): string;
}

class ClientMessageServiceStub {
  requests: ClientMessageRequest[] = [];

  send(request: ClientMessageRequest) {
    this.requests.push(request);
    return of({ id: 'conversation-id', mensagem: 'Mensagem recebida.' });
  }
}

describe('ClienteMessage', () => {
  let fixture: ComponentFixture<ClienteMessage>;
  let component: ClienteMessageHarness;
  let service: ClientMessageServiceStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteMessage],
      providers: [{ provide: ClientMessageService, useClass: ClientMessageServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteMessage);
    component = fixture.componentInstance as unknown as ClienteMessageHarness;
    service = TestBed.inject(ClientMessageService) as unknown as ClientMessageServiceStub;
  });

  it('does not call the API when the form is invalid', () => {
    component.send();
    expect(service.requests).toHaveLength(0);
  });

  it('sends the backend payload and resets after success', () => {
    component.messageForm.setValue({
      email: 'cliente@example.com',
      assunto: 'Visita a um imóvel',
      descricao: 'Gostaria de agendar uma visita.',
    });

    component.send();

    expect(service.requests).toEqual([{
      email: 'cliente@example.com',
      assunto: 'Visita a um imóvel',
      descricao: 'Gostaria de agendar uma visita.',
    }]);
    expect(component.state()).toBe('success');
    expect(component.feedback()).toBe('Mensagem recebida.');
    expect(component.messageForm.controls['email'].value).toBe('');
  });
});
