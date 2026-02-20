import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAnchor } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { UserLogin } from '../model/userLogin';



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

  private formBuilder = inject(FormBuilder);

    user: UserLogin = {
    email: '',
    password: ''
  }

  loginForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
    });

  onSubmit(){
    
    this.user.email = this.loginForm.value.email ?? '';
    this.user.password = this.loginForm.value.password ?? '';
    
    console.log(this.loginForm.value);
    // { firstName: 'Nancy', lastName: 'Drew' }
  }

}
