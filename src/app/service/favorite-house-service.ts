import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { MessageInfo } from '../user/messageInfo';
import { HouseResponse } from '../models/house/house-response';

@Injectable({
  providedIn: 'root',
})
export class FavoriteHouseService {

    private httpClient = inject(HttpClient);

    private api = environment.apiUrl;

    save(houseId: string): Observable<MessageInfo> {
       return this.httpClient.post<MessageInfo>(`${this.api}/favorite-houses/${houseId}`, {});
    }

    findAll(pageNumber: number): Observable<HouseResponse[]> {
        return this.httpClient
        .get<HouseResponse[]>(`${this.api}/favorite-houses?page=${pageNumber}`);  
    }
  
}
