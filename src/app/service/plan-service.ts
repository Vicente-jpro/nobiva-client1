import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlanModel } from '../models/plan';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/plans';

  findAll(): Observable<PlanModel[]> {
    return this.http.get<PlanModel[]>(this.apiUrl);
  }

  findById(id: string): Observable<PlanModel> {
    return this.http.get<PlanModel>(`${this.apiUrl}/${id}`);
  }

  save(plan: PlanModel): Observable<PlanModel> {
    return this.http.post<PlanModel>(this.apiUrl, plan);
  }

  update(id: string, plan: PlanModel): Observable<PlanModel> {
    return this.http.patch<PlanModel>(`${this.apiUrl}/${id}`, plan);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
