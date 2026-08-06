import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  ClientMessageRequest,
  ConversationDetailResponse,
  ConversationFilters,
  ConversationMessageRequest,
  ConversationMessageResponse,
  ConversationSummaryResponse,
  PageResponse,
  PublicConversationCreatedResponse,
} from '../models/client-message';

@Injectable({ providedIn: 'root' })
export class ClientMessageService {
  private readonly httpClient = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/client-messages`;

  send(request: ClientMessageRequest): Observable<PublicConversationCreatedResponse> {
    return this.httpClient.post<PublicConversationCreatedResponse>(this.endpoint, request);
  }

  findAll(
    page: number,
    size: number,
    filters: ConversationFilters = {},
  ): Observable<PageResponse<ConversationSummaryResponse>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (filters.estado) params = params.set('estado', filters.estado);
    if (filters.email?.trim()) params = params.set('email', filters.email.trim());

    return this.httpClient.get<PageResponse<ConversationSummaryResponse>>(this.endpoint, { params });
  }

  findOne(id: string): Observable<ConversationDetailResponse> {
    return this.httpClient.get<ConversationDetailResponse>(`${this.endpoint}/${id}`);
  }

  reply(id: string, request: ConversationMessageRequest): Observable<ConversationMessageResponse> {
    return this.httpClient.post<ConversationMessageResponse>(`${this.endpoint}/${id}/messages`, request);
  }
}
