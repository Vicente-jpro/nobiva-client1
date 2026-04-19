import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HouseCreateRequest } from '../models/house/house-create-request';
import { Observable } from 'rxjs';
import {HouseResponseDetails } from '../models/house/house-response-details';
import { HouseResponse } from '../models/house/house-response';
import { MessageInfo } from '../user/messageInfo';
import { TypeNegotiation } from '../models/negotiation-type';

@Injectable({
  providedIn: 'root',
})
export class HouseService {
  
  private httpClient = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api'; // URL da API para usuários
  

  save(house: HouseCreateRequest): Observable<HouseResponseDetails> {
    return this.httpClient.post<HouseResponseDetails>(`${this.apiUrl}/houses`, house);
  }

  findByTypeNegotiation(
    typeNegotiation: TypeNegotiation, 
    pageNumber: number): Observable<HouseResponse[]> {
    return this.httpClient
    .get<HouseResponse[]>(`${this.apiUrl}/houses?type-negotiation=${typeNegotiation}&page=${pageNumber}`);
  }

  delete(idHouse: string): Observable<MessageInfo> {
    return this.httpClient.delete<MessageInfo>(`${this.apiUrl}/houses/${idHouse}`);
  }

  uploadImages(idHouse: string, images: FormData): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/houses/${idHouse}/images`, images);
  }

  findById(idHouse: string): Observable<HouseResponseDetails> {
    return this.httpClient.get<HouseResponseDetails>(`${this.apiUrl}/houses/${idHouse}`);
  }

  update(idHouse: string, house: HouseCreateRequest): Observable<HouseResponseDetails> {
    return this.httpClient.put<HouseResponseDetails>(`${this.apiUrl}/houses/${idHouse}`, house);
  }

  findAllByOwner(pageNumber: number): Observable<HouseResponse[]> {
    return this.httpClient.get<HouseResponse[]>(`${this.apiUrl}/houses/user-owner?page=${pageNumber}`);
  }
  
}
