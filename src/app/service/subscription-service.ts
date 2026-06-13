import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubscriptionModel, SubscriptionRequest } from '../models/subscription';
import { PlanModel } from '../models/plan';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/subscriptions';

  subscribe(plan: PlanModel): Observable<string> {
    console.log('Subscribing to plan:', plan);
    return this.http.post(this.apiUrl, plan, { responseType: 'text' });
  }

  update(request: SubscriptionRequest): Observable<string> {
    return this.http.patch(this.apiUrl, request, { responseType: 'text' });
  }

  activate(userId: string, request: SubscriptionRequest): Observable<string> {
    return this.http.patch(`${this.apiUrl}/${userId}/activate`, request, { responseType: 'text' });
  }

  findByStatus(status: string): Observable<SubscriptionModel[]> {
    return this.http.get<SubscriptionModel[]>(`${this.apiUrl}?status=${status}`);
  }

  findByUser(): Observable<SubscriptionModel> {
    return this.http.get<SubscriptionModel>(`${this.apiUrl}/user-owner`);
  }
}
