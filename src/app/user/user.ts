import { Component, inject } from '@angular/core';
import { UserService } from './service/user-service';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessage } from '../dialog-message/dialog-message';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class User {

  private service = inject(UserService);
  private dialog = inject(MatDialog);

  private dialogTitleData: string = '';
  private dialogContentData: string = '';

  openDialog() {
    this.dialog.open(DialogMessage, {
      data: {
        title: this.dialogTitleData,
        content: this.dialogContentData
      }
    });
  }

  logout(): void {
    
    this.service.logout().subscribe({
      next: () => {
        this.dialogTitleData = 'Logout bem-sucedido';
        this.dialogContentData = 'Você saiu da sua conta com sucesso.';
        this.openDialog();
        console.log('Logout successful');
        // Optionally, you can also clear any client-side authentication data here
      },
      error: (error) => {
        this.dialogTitleData = 'Erro ao sair';
        this.dialogContentData = 'Ocorreu um erro ao tentar sair da sua conta. Por favor, tente novamente.';
        this.openDialog();
        console.error('Logout failed:', error);
      }
    });
        
  }
}
