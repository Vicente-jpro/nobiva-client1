import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageInfo } from '../user/messageInfo';
import { UserSignup } from '../models/user/userSignup';
import { UserLogin } from '../models/user/userLogin';
import { UserLoginResponse } from '../models/user/userLoginResponse';
import { UserEmail } from '../models/user/UserEmail';
import { UserChangePassword } from '../models/user/userChangePassword';
import { environment } from '../../environments/environment';
import { UserProfile, UserUpdateRequest } from '../models/user/user-profile';


@Injectable({
  providedIn: 'root',
})
export class UserService {

  private httpClient = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getCurrentUser(): Observable<UserProfile> {
    return this.httpClient.get<UserProfile>(`${this.apiUrl}/auth/profile`);
  }

  updateCurrentUser(request: UserUpdateRequest): Observable<UserLoginResponse> {
    return this.httpClient.patch<UserLoginResponse>(
      `${this.apiUrl}/auth/profile`,
      request,
      this.httpOptions
    );
  }

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
