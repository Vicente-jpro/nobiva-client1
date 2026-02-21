import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAnchor } from "@angular/material/button";
import { Router } from "@angular/router";
import { UserService } from '../service/user-service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessage } from '../../dialog-message/dialog-message';

@Component({
  selector: 'app-change-password',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatAnchor
  ],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePassword implements OnInit {
  readonly dialog = inject(MatDialog);

  private route = inject(ActivatedRoute);
  private service = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  private token: string = '';
  private dialogTitleData: string = '';
  private dialogContentData: string = '';

  user: UserChangePassword = {
    newPassword: '',
    confirmePassword: ''
  }

  changePasswordForm = this.formBuilder.group({
    newPassword: [this.user.newPassword, [Validators.required, Validators.minLength(6)]],
    confirmePassword: [this.user.confirmePassword, [Validators.required, Validators.minLength(6)]],
  });

  openDialog() {
    this.dialog.open(DialogMessage, {
      data: {
        title: this.dialogTitleData,
        content: this.dialogContentData
      }
    });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

  }

  onSubmit() {
    /**  if (this.changePasswordForm.invalid) {
       this.loginForm.markAllAsTouched();
       return;
     }
       */
    this.user = this.changePasswordForm.value as UserChangePassword;
    
    this.service.changePassword(this.user, this.token).subscribe({
      next: (response) => {
        this.dialogTitleData = 'Redefinição de palavra passe';
        this.dialogContentData = response.message;
        console.log("user password changed", this.user);

        this.openDialog();
        this.router.navigate(['/user/login']);
      },
      error: (errorResponse) => {
        this.dialogTitleData = 'Erro na redefinição de palavra passe';
        this.dialogContentData = errorResponse.error.message;
        this.openDialog();
      }

    });
  }

}
