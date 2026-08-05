import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ClientMessageApiRequest, ClientMessageRequest } from '../models/client-message';
import { MessageInfo } from '../user/messageInfo';

@Injectable({ providedIn: 'root' })
export class ClientMessageService {
  private readonly httpClient = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/email-tasks`;

  send(request: ClientMessageRequest): Observable<MessageInfo> {
    const payload: ClientMessageApiRequest = {
      ownerEmail: 'suporte@nobiva.com', // TODO: substituir pelo email oficial da empresa.
      clientEmail: request.email,
      subject: request.subject,
      message: request.description,
    };

    return this.httpClient.post<MessageInfo>(this.endpoint, payload);
  }
}
