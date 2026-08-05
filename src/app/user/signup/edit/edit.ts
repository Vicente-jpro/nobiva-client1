import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../service/user-service';
import { AuthService } from '../../../service/auth.service';
import { DisplayMessage } from '../../../models/display-message';
import { publicApiErrors } from '../../../models/api-error';
import { UserUpdateRequest } from '../../../models/user/user-profile';
import { Success } from '../../../alerts/success/success';
import { Danger } from '../../../alerts/danger/danger';

@Component({
  selector: 'app-edit',
  imports: [ReactiveFormsModule, RouterLink, Success, Danger],
  templateUrl: './edit.html',
  styleUrl: './edit.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Edit implements OnInit {
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private changeDetector = inject(ChangeDetectorRef);

  protected loading = true;
  protected saving = false;
  protected initialEmail = '';
  protected display = new DisplayMessage();

  protected profileForm = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(155)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(55)]],
    currentPassword: ['', [Validators.maxLength(72)]],
  });

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: profile => {
        this.initialEmail = profile.email;
        this.profileForm.patchValue({
          username: profile.username,
          email: profile.email,
        });
        this.loading = false;
        this.changeDetector.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        this.display = {
          success: '',
          errors: publicApiErrors(error, 'Não foi possível carregar o perfil.'),
        };
        this.loading = false;
        this.changeDetector.markForCheck();
      },
    });
  }

  protected emailChanged(): boolean {
    return this.profileForm.controls.email.value.trim().toLowerCase()
      !== this.initialEmail.trim().toLowerCase();
  }

  protected save(): void {
    this.display = new DisplayMessage();
    this.profileForm.markAllAsTouched();

    const password = this.profileForm.controls.currentPassword.value;
    if (this.emailChanged() && password.length < 8) {
      this.display = {
        success: '',
        errors: ['Informe a password atual para alterar o email.'],
      };
      return;
    }
    if (this.profileForm.invalid) return;

    const value = this.profileForm.getRawValue();
    const request: UserUpdateRequest = {
      username: value.username.trim(),
      email: value.email.trim(),
      ...(password ? { currentPassword: password } : {}),
    };

    this.saving = true;
    this.userService.updateCurrentUser(request).subscribe({
      next: response => {
        this.authService.saveAuthData(response);
        this.initialEmail = response.email;
        this.profileForm.patchValue({
          username: response.username,
          email: response.email,
          currentPassword: '',
        });
        this.display = { success: 'Perfil atualizado com sucesso.', errors: [] };
        this.saving = false;
        this.changeDetector.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        this.display = {
          success: '',
          errors: publicApiErrors(error, 'Não foi possível atualizar o perfil.'),
        };
        this.saving = false;
        this.changeDetector.markForCheck();
      },
    });
  }

}
