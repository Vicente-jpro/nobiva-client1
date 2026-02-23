import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserSignup } from '../model/userSignup';
import { Observable } from 'rxjs';
import { MessageInfo } from '../messageInfo';
import { UserLogin } from '../model/userLogin';
import { UserLoginResponse } from '../model/userLoginResponse';
import { UserEmail } from '../model/UserEmail';

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

  resetPassword(userEmail: UserEmail): Observable<MessageInfo> {
    return this.httpClient.post<MessageInfo>(
      `${this.apiUrl}/auth/account/reset-password`, 
       userEmail
    );
  }

  changePassword(changePassword: UserChangePassword, token: string): Observable<MessageInfo> {
    let params = new HttpParams() 
    .set('token', token);

    return this.httpClient.post<MessageInfo>(
      `${this.apiUrl}/auth/account/change-password`, 
      changePassword, 
        { params }
    );
  }

  logout(): Observable<MessageInfo> {
    return this.httpClient.post<MessageInfo>(
      `${this.apiUrl}/auth/logout`, 
      {}
    );
  }

  confimeAccount(token: string): Observable<MessageInfo> {
    let params = new HttpParams() 
    .set('token', token); 

    return this.httpClient.get<MessageInfo>(
      `${this.apiUrl}/auth/account/confirme-account`, 
      { params }
    );
  }

  sendVerificationEmail(userEmail: UserEmail): Observable<MessageInfo> {
    return this.httpClient.post<MessageInfo>(
      `${this.apiUrl}/auth/account/send-verification-email`, 
       userEmail
    );
  }

}
