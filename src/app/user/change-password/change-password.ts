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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-change-password',
  imports: [
        ReactiveFormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatAnchor, 
    RouterLink
  ],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePassword {
  private route = inject(ActivatedRoute);
  private service = inject(UserService);
  private formBuilder = inject(FormBuilder);

    user: UserChangePassword = {
    newPassword: '',
    confirmePassword: ''
  }

  changePasswordForm = this.formBuilder.group({
      newPassword: [this.user.newPassword, [Validators.required, Validators.minLength(6)]],
      confirmePassword: [this.user.confirmePassword, [Validators.required, Validators.minLength(6)]],
    });

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');

  }

  onSubmit(){
   /**  if (this.changePasswordForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
      */


  }

}
