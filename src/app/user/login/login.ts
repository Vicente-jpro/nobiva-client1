import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
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
