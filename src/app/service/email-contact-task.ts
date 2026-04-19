import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MessageInfo } from '../user/messageInfo';
import { Observable } from 'rxjs';
import { EmailContactTask } from '../models/email-contact-task';

@Injectable({
  providedIn: 'root',
})
export class EmailContactTaskService {

  private httpClient = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api'; // URL da API para usuários
  
  public send(message: EmailContactTask): Observable<MessageInfo> {
    return this.httpClient.post<MessageInfo>(`${this.apiUrl}/email-tasks`, message);
  }
}
