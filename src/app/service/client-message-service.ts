import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  ClientMessageRequest,
  ClientMessageResponse,
  PageResponse,
} from '../models/client-message';

@Injectable({ providedIn: 'root' })
export class ClientMessageService {
  private readonly httpClient = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/client-messages`;

  send(request: ClientMessageRequest): Observable<ClientMessageResponse> {
    return this.httpClient.post<ClientMessageResponse>(this.endpoint, request);
  }

  findAll(page: number, size: number): Observable<PageResponse<ClientMessageResponse>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.httpClient.get<PageResponse<ClientMessageResponse>>(this.endpoint, { params });
  }

  retry(id: string): Observable<ClientMessageResponse> {
    return this.httpClient.post<ClientMessageResponse>(`${this.endpoint}/${id}/retry`, null);
  }
}
