import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAnchor } from "@angular/material/button";
import { Router, RouterLink } from "@angular/router";
import { UserLogin } from '../model/userLogin';
import { UserService } from '../service/user-service';
import { AuthService } from '../service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessage } from '../../dialog-message/dialog-message';



@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatAnchor, 
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private dialog = inject(MatDialog)
  private service = inject(UserService);
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  private dialogTitleData: string = '';
  private dialogContentData: string = '';

    user: UserLogin = {
    email: '',
    password: ''
  }

    openDialog() {
      this.dialog.open(DialogMessage, {
        data: {
          title: this.dialogTitleData,
          content: this.dialogContentData
        }
      });
    }


  loginForm = this.formBuilder.group({
      email: [this.user.email, [Validators.required, Validators.email]],
      password: [this.user.password, [Validators.required]],
    });

  onSubmit(){
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    this.user.email = this.loginForm.value.email ?? '';
    this.user.password = this.loginForm.value.password ?? '';
    
    this.service.login(this.user).subscribe({
      next: (response) => {
        // Store authentication data using auth service
        this.router.navigate(['/home']);

      },
      
      error: (errorResponse) => {

        this.dialogTitleData = 'Erro de autenticação';
        this.dialogContentData = 'Email ou a Palavra passe está incorreto.';
        this.openDialog();
        console.error('Login failed:', errorResponse);
        // You might want to show an error message to the user here
        // For example, using a snackbar or alert
      }
    });
  }



}
