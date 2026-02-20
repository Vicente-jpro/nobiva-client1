import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserSignup } from '../model/userSignup';
import { Observable } from 'rxjs';
import { MessageInfo } from '../messageInfo';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private httpClient = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api'; // URL da API para usuários
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  save(User: UserSignup): Observable<MessageInfo> {

    return this.httpClient.post<MessageInfo>(
      `${this.apiUrl}/auth/signup`, 
      User, 
      this.httpOptions
    );

  }
  
}
