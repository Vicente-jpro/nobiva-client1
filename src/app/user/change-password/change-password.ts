import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../service/user-service';
import { DisplayMessage } from '../../models/display-message';
import { Success } from '../../alerts/success/success';
import { Danger } from '../../alerts/danger/danger';
import { UserChangePassword } from '../../models/user/userChangePassword';

@Component({
  selector: 'app-change-password',
  imports: [
    ReactiveFormsModule,
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
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    this.user = this.changePasswordForm.value as UserChangePassword;

    if (this.user.newPassword !== this.user.confirmePassword) {
      this.display = { success: '', errors: ['As palavras-passe não coincidem.'] };
      return;
    }
    
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
