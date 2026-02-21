import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAnchor } from "@angular/material/button";
import { Router, RouterLink } from "@angular/router";
import { UserService } from '../service/user-service';
import { UserEmail } from '../model/UserEmail';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessage } from '../../dialog-message/dialog-message';

@Component({
  selector: 'app-password-recover',
  imports: [

    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatAnchor,
    RouterLink

  ],
  templateUrl: './password-recover.html',
  styleUrl: './password-recover.scss',
})
export class PasswordRecover {
  readonly dialog = inject(MatDialog);
  private service = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  dialogTitleData: string = '';
  dialogContentData: string = '';

  user: UserEmail = { email: '' }

  loginForm = this.formBuilder.group({
    email: [this.user.email, [Validators.required, Validators.email]],
  });

  openDialog() {
    this.dialog.open(DialogMessage, {
      data: {
        title: this.dialogTitleData,
        content: this.dialogContentData
      }
    });
  }
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.user = this.loginForm.value as UserEmail;

    this.user.email = this.loginForm.value.email ?? '';

    this.service.resetPassword(this.user).subscribe({
      next: (response) => {

        this.dialogTitleData = 'Pedido de recuperação de palavra passe';
        this.dialogContentData = response.message;

        this.openDialog();

        console.log('Password reset request:', response.message);

     
      },
      error: (errorResponse) => {
        console.error('Login failed:', errorResponse);
        // You might want to show an error message to the user here
        // For example, using a snackbar or alert
      }
    });
  }

}
