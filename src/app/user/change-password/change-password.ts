import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAnchor } from "@angular/material/button";
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../service/user-service';
import { DisplayMessage } from '../../models/display-message';
import { Success } from '../../alerts/success/success';
import { Danger } from '../../alerts/danger/danger';

@Component({
  selector: 'app-change-password',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatAnchor,
    Success,
    Danger
  ],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePassword implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private changeDetection = inject(ChangeDetectorRef);

  private token: string = '';

  display = new DisplayMessage();

  user: UserChangePassword = {
    newPassword: '',
    confirmePassword: ''
  }

  changePasswordForm = this.formBuilder.group({
    newPassword: [this.user.newPassword, [Validators.required, Validators.minLength(6)]],
    confirmePassword: [this.user.confirmePassword, [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

  }

  onSubmit() {
    this.user = this.changePasswordForm.value as UserChangePassword;
    
    this.service.changePassword(this.user, this.token).subscribe({
      next: (response) => {
        this.display = { success: response.message, errors: [] };
        console.log("user password changed", this.user);
        this.changeDetection.markForCheck();
        this.router.navigate(['/user/login']);
      },
      error: (errorResponse) => {
        this.display = { success: '', errors: errorResponse.error.errors || ['Erro ao redefinir a palavra passe.'] };
      }
    });
  }

}
