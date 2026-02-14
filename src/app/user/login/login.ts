import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatAnchor } from "@angular/material/button";

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatCardModule, MatInputModule, MatAnchor],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private formBuilder = inject(FormBuilder);
   
  loginForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
    });

  onSubmit(){
    
    console.log(this.loginForm.value);
    // { firstName: 'Nancy', lastName: 'Drew' }
  }

}
