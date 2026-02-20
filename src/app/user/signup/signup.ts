import { Component, inject } from '@angular/core';
import { Form } from "./form/form";
import { UserService } from '../service/user-service';
import { UserSignup } from '../model/userSignup';
import { DialogMessage } from '../../dialog-message/dialog-message';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  imports: [Form],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  readonly dialog = inject(MatDialog);
  private service = inject(UserService);
  private router = inject(Router)

  formTitle: string = 'Criar conta';
  dialogTitleData: string = '';
  dialogContentData: string = '';

  openDialog() {
    this.dialog.open(DialogMessage, {
      data: {
        title: this.dialogTitleData,
        content: this.dialogContentData
      }
    });
  }

  onSubmit(user: UserSignup){
    console.log('User submitted:', user);
    this.save(user);
  }

  save(user: UserSignup) {
    this.service.save(user).subscribe({
      next: (response) => {
        this.dialogTitleData = user.username ? `Bem-vindo, ${user.username}!` : 'Bem-vindo!';
        this.dialogContentData = response.message;
        this.router.navigate(['/login']);
        this.openDialog();

      },
      error: (errorResponse) => {
        this.dialogTitleData = 'Erro ao criar conta';
        this.dialogContentData =  errorResponse.error.message;
        
        if(user.password !== user.passwordConfirmed) {
          this.dialogTitleData = 'Erro de validação';
          this.dialogContentData = 'Palavra passe de confirmação não pode ser diferente da palavra passe.';
        }
        this.openDialog();
        
      }
    });
  }



}
