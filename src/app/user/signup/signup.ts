import { Component, inject } from '@angular/core';
import { Form } from "./form/form";
import { UserService } from '../service/user-service';
import { UserSignup } from '../model/userSignup';
import { DialogMessage } from '../../dialog-message/dialog-message';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-signup',
  imports: [Form],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  readonly dialog = inject(MatDialog);
  private service = inject(UserService);

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
        
        this.openDialog();

        console.log('User saved successfully:', response.message);
      },
      error: (error) => {
        this.dialogTitleData = 'Erro';
        this.dialogContentData = 'Failed to save user. Please try again.';
        
        this.openDialog();
        
        console.error('Error saving user:', error);
      }
    });
  }



}
