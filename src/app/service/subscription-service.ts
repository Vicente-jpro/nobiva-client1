import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubscriptionModel, SubscriptionRequest } from '../models/subscription';
import { PlanModel } from '../models/plan';
import { MessageInfo } from '../user/messageInfo';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/subscriptions';

  subscribe(plan: PlanModel): Observable<MessageInfo> {
    console.log('Subscribing to plan:', plan);
    return this.http.post<MessageInfo>(this.apiUrl, plan);
  }

  update(request: SubscriptionRequest): Observable<MessageInfo> {
    return this.http.patch<MessageInfo>(this.apiUrl, request);
  }

  activate(userId: string, request: SubscriptionRequest): Observable<MessageInfo> {
    return this.http.patch<MessageInfo>(`${this.apiUrl}/${userId}/activate`, request);

  }

  findByStatus(status: string): Observable<SubscriptionModel[]> {
    return this.http.get<SubscriptionModel[]>(`${this.apiUrl}?status=${status}`);
  }

  findByUser(): Observable<SubscriptionModel> {
    return this.http.get<SubscriptionModel>(`${this.apiUrl}/user-owner`);
  }
}
