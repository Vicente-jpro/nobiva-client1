import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HouseCreateRequest } from '../models/house/house-create-request';
import { Observable } from 'rxjs';
import { HouseResponse } from '../models/house/house-response';

@Injectable({
  providedIn: 'root',
})
export class HouseService {
  
  private httpClient = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api'; // URL da API para usuários
  

  save(house: HouseCreateRequest): Observable<HouseResponse> {
    return this.httpClient.post<HouseResponse>(`${this.apiUrl}/houses`, house);
  }

  findAll(): Observable<HouseResponse[]> {
    return this.httpClient.get<HouseResponse[]>(`${this.apiUrl}/houses`);
  }
}
