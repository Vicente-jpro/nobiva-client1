import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAnchor } from "@angular/material/button";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { UserLogin } from '../model/userLogin';
import { UserService } from '../service/user-service';



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
    
    this.user.email = this.loginForm.value.email ?? '';
    this.user.password = this.loginForm.value.password ?? '';
    
    this.service.login(this.user).subscribe({
      next: (response) => {

        this.router.navigate(['/home']);
        console.log('Login successful:', response);
      },
      error: (errorResponse) => {
        console.error('Login failed:', errorResponse);
      }
    });

    console.log(this.loginForm.value);
    // { firstName: 'Nancy', lastName: 'Drew' }
  }



}
