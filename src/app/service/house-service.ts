import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HouseCreateRequest } from '../models/house/house-create-request';
import { Observable } from 'rxjs';
import {HouseResponseDetails } from '../models/house/house-response-details';
import { HouseResponse } from '../models/house/house-response';

@Injectable({
  providedIn: 'root',
})
export class HouseService {
  
  private httpClient = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api'; // URL da API para usuários
  

  save(house: HouseCreateRequest): Observable<HouseResponseDetails> {
    return this.httpClient.post<HouseResponseDetails>(`${this.apiUrl}/houses`, house);
  }

  findAll(): Observable<HouseResponse[]> {
    return this.httpClient.get<HouseResponse[]>(`${this.apiUrl}/houses`);
  }

  delete(idHouse: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/houses/${idHouse}`);
  }

  uploadImages(idHouse: string, images: FormData): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/houses/${idHouse}/images`, images);
  }

  findById(idHouse: string): Observable<HouseResponseDetails> {
    return this.httpClient.get<HouseResponseDetails>(`${this.apiUrl}/houses/${idHouse}`);
  }

  
}
