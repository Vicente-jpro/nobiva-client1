import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HouseCreateRequest } from '../models/house/house-create-request';
import { Observable, Subject } from 'rxjs';
import {HouseResponseDetails } from '../models/house/house-response-details';
import { HouseResponse } from '../models/house/house-response';
import { MessageInfo } from '../user/messageInfo';
import { HouseFilter } from '../models/house/house-filter';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HouseService {
  
  private httpClient = inject(HttpClient);

  filterChanged$ = new Subject<HouseFilter>();

  emitFilter(filter: HouseFilter): void {
    this.filterChanged$.next(filter);
  }

  private readonly apiUrl = environment.apiUrl;
  

  save(house: HouseCreateRequest): Observable<HouseResponseDetails> {
    return this.httpClient.post<HouseResponseDetails>(`${this.apiUrl}/houses`, house);
  }

  delete(idHouse: string): Observable<MessageInfo> {
    return this.httpClient.delete<MessageInfo>(`${this.apiUrl}/houses/${idHouse}`);
  }

  deleteOwned(idHouse: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/houses/${idHouse}/user-owner`);
  }

  uploadImages(idHouse: string, images: FormData): Observable<HouseResponseDetails> {
    return this.httpClient.post<HouseResponseDetails>(`${this.apiUrl}/houses/${idHouse}/images`, images);
  }

  findById(idHouse: string): Observable<HouseResponseDetails> {
    return this.httpClient.get<HouseResponseDetails>(`${this.apiUrl}/houses/${idHouse}`);
  }

  update(idHouse: string, house: HouseCreateRequest): Observable<HouseResponseDetails> {
    return this.httpClient.patch<HouseResponseDetails>(`${this.apiUrl}/houses/${idHouse}`, house);
  }

  findAllByOwner(pageNumber: number): Observable<HouseResponse[]> {
    return this.httpClient.get<HouseResponse[]>(`${this.apiUrl}/houses/user-owner?page=${pageNumber}`);
  }

  findByFilter(houseFilter: HouseFilter, pageNumber: number): Observable<HouseResponse[]> {
    return this.httpClient.post<HouseResponse[]>(`${this.apiUrl}/houses/filter?page=${pageNumber}`, houseFilter);
  }

  approve(idHouse: string): Observable<MessageInfo> {
    return this.httpClient.patch<MessageInfo>(`${this.apiUrl}/houses/${idHouse}/approve`, {});
  }

  reject(idHouse: string): Observable<MessageInfo> {
    return this.httpClient.patch<MessageInfo>(`${this.apiUrl}/houses/${idHouse}/reject`, {});
  }
  
}
