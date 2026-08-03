import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubscriptionModel, SubscriptionRequest } from '../models/subscription';
import { PlanModel } from '../models/plan';
import { MessageInfo } from '../user/messageInfo';
import { environment } from '../../environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/subscriptions`;

  subscribe(plan: PlanModel): Observable<MessageInfo> {
    return this.http.post<MessageInfo>(this.apiUrl, plan);
  }

  update(request: SubscriptionRequest): Observable<MessageInfo> {
    return this.http.patch<MessageInfo>(this.apiUrl, request);
  }

  activate(userId: string, request: SubscriptionRequest): Observable<MessageInfo> {
    return this.http.patch<MessageInfo>(`${this.apiUrl}/${userId}/activate`, request);

  }

  findByStatus(status: string): Observable<SubscriptionModel[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<SubscriptionModel[]>(this.apiUrl, { params });
  }

  findByUser(): Observable<SubscriptionModel> {
    return this.http.get<SubscriptionModel>(`${this.apiUrl}/user-owner`);
  }
}
