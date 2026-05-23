import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../service/user-service';
import { AuthService } from '../service/auth.service';
import { Danger } from '../alerts/danger/danger';
import { Success } from '../alerts/success/success';
import { DisplayMessage } from '../models/display-message';

@Component({
  selector: 'app-user',
  imports: [Danger, Success],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class User {

  private service = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  display = new DisplayMessage();

  logout(): void {
    
    this.service.logout().subscribe({
      next: () => {
        this.authService.logout();
        this.display = { success: 'Você saiu da sua conta com sucesso.', errors: [] };
        console.log('Logout successful');
        this.router.navigate(['/user/login']);
      },
      error: (error) => {
        this.authService.logout();
        this.display = { success: '', errors: ['Sessão encerrada localmente.'] };
        console.error('Logout failed:', error);
        this.router.navigate(['/user/login']);
      }
    });
        
  }
}
