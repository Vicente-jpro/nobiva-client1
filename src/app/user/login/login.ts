import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAnchor } from "@angular/material/button";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { UserLogin } from '../model/userLogin';
import { UserService } from '../service/user-service';
import { AuthService } from '../service/auth.service';



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
  private service = inject(UserService);
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

    user: UserLogin = {
    email: '',
    password: ''
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
        this.authService.saveAuthData(response);

        console.log('Login successful:', response);
        console.log('User roles:', this.authService.getRoles());
        
        this.router.navigate(['/home']);
      },
      error: (errorResponse) => {
        console.error('Login failed:', errorResponse);
        // You might want to show an error message to the user here
        // For example, using a snackbar or alert
      }
    });
  }



}
