import { Component, inject } from '@angular/core';
import { UserService } from './service/user-service';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessage } from '../dialog-message/dialog-message';
import { AuthService } from './service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class User {

  private service = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);
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
        // Clear client-side authentication data
        this.authService.logout();
        this.dialogTitleData = 'Logout bem-sucedido';
        this.dialogContentData = 'Você saiu da sua conta com sucesso.';
        this.openDialog();
        console.log('Logout successful');
        // Redirect to login page
        this.router.navigate(['/user/login']);
      },
      error: (error) => {
        // Even if server logout fails, clear local data and redirect
        this.authService.logout();
        this.dialogTitleData = 'Erro ao sair';
        this.dialogContentData = 'Sessão encerrada localmente.';
        this.openDialog();
        console.error('Logout failed:', error);
        this.router.navigate(['/user/login']);
      }
    });
        
  }
}
