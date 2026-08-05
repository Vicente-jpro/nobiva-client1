import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../service/user-service';
import { AuthService } from '../../../service/auth.service';
import { DisplayMessage } from '../../../models/display-message';
import { publicApiErrors } from '../../../models/api-error';
import { UserProfile, UserUpdateRequest } from '../../../models/user/user-profile';
import { Form } from '../form/form';

@Component({
  selector: 'app-edit',
  imports: [Form],
  templateUrl: './edit.html',
  styleUrl: './edit.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Edit implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private changeDetector = inject(ChangeDetectorRef);

  protected loading = true;
  protected saving = false;
  protected display = new DisplayMessage();
  protected profile: UserProfile | null = null;

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: profile => {
        this.profile = profile;
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

  protected save(request: UserUpdateRequest): void {
    this.display = new DisplayMessage();
    this.saving = true;
    this.userService.updateCurrentUser(request).subscribe({
      next: response => {
        this.authService.saveAuthData(response);
        this.profile = {
          id: this.profile?.id || '',
          username: response.username,
          email: response.email,
        };
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
