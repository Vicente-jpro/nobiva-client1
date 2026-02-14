import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatAnchor } from "@angular/material/button";
import { RouterLink } from "@angular/router";


interface User{   
    username: string;
    email: string;
    password: string;    
    passwordConfirmed: string;
    roles: string[];
}

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule, 
    MatCardModule, 
    MatInputModule, 
    MatAnchor, 
    RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  private formBuilder = inject(FormBuilder);

    user: User = {
    email: '',
    username: '',
    password: '',
    passwordConfirmed: '',
    roles: []
  }

  loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      passwordConfirmed: ['', [Validators.required, Validators.minLength(3)]],
      roles: ['', [Validators.required]]
    });

  onSubmit(){
    
    this.user.email = this.loginForm.value.email ?? '';
    this.user.password = this.loginForm.value.password ?? '';
    
    console.log(this.loginForm.value);
    // { firstName: 'Nancy', lastName: 'Drew' }
  }

}
