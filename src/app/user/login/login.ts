import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { UserLogin } from '../../models/user/userLogin';
import { UserService } from '../../service/user-service';
import { AuthService } from '../../service/auth.service';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private service = inject(UserService);
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  errorMessage = '';

  user: UserLogin = {
    email: '',
    password: ''
  };

  loginForm = this.formBuilder.group({
    email: [this.user.email, [Validators.required, Validators.email]],
    password: [this.user.password, [Validators.required]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.user = this.loginForm.value as UserLogin;
    this.user.email = this.loginForm.value.email ?? '';
    this.user.password = this.loginForm.value.password ?? '';

    this.service.login(this.user).subscribe({
      next: (response) => {
        this.authService.saveAuthData(response);
        this.router.navigate(['/home']);
      },
      error: (errorResponse) => {
        this.errorMessage = 'Email ou a Palavra passe está incorreto.';
        console.error('Login failed:', errorResponse);
      }
    });
  }
}
