import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { UserEmail } from '../../models/user/UserEmail';
import { UserService } from '../../service/user-service';
import { DisplayMessage } from '../../models/display-message';
import { Success } from '../../alerts/success/success';
import { Danger } from '../../alerts/danger/danger';

@Component({
  selector: 'app-password-recover',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    Success,
    Danger
  ],
  templateUrl: './password-recover.html',
  styleUrl: './password-recover.scss',
})
export class PasswordRecover {
  private service = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private changeDetection = inject(ChangeDetectorRef);
  display = new DisplayMessage();

  user: UserEmail = { email: '' }

  loginForm = this.formBuilder.group({
    email: [this.user.email, [Validators.required, Validators.email]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.user = this.loginForm.value as UserEmail;

    this.user.email = this.loginForm.value.email ?? '';

    this.service.resetPassword(this.user).subscribe({
      next: (response) => {
        this.display = { success: response.message, errors: [] };
        this.changeDetection.markForCheck();
        console.log('Password reset request:', response.message);
      },
      error: (err) => {
        this.display = { success: '', errors: err.error.errors || ['Erro ao enviar o email de recuperação.'] };
        console.error('Password recover failed:', err);
        this.changeDetection.markForCheck();
      }
    });
  }

}
