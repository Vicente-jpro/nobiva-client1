import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserSignup } from '../model/userSignup';
import { Observable } from 'rxjs';
import { MessageInfo } from '../messageInfo';
import { UserLogin } from '../model/userLogin';
import { UserLoginResponse } from '../model/userLoginResponse';

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

  signin(User: UserSignup): Observable<MessageInfo> {

    return this.httpClient.post<MessageInfo>(
      `${this.apiUrl}/auth/signin`, 
      User, 
      this.httpOptions
    );
  }

  login(user: UserLogin): Observable<UserLoginResponse> {

    return this.httpClient.post<UserLoginResponse>(
      `${this.apiUrl}/auth/signin`, 
      user, 
      this.httpOptions
    );
  }
}
