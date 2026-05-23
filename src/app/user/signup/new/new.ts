import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Form } from '../form/form';
import { UserSignup } from '../../../models/user/userSignup';
import { UserRole } from '../../../models/user/userRole';
import { UserService } from '../../../service/user-service';
import { DisplayMessage } from '../../../models/display-message';

@Component({
  selector: 'app-new',
  imports: [Form],
  templateUrl: './new.html'
})
export class New {
  private service = inject(UserService);
  private router = inject(Router);
  private changeDetection = inject(ChangeDetectorRef);
  readonly role = UserRole;

  protected formTitle: string = 'Criar conta';
  display = new DisplayMessage();

  onSubmit(user: UserSignup) {
    this.save(user);
  }

  save(user: UserSignup) {
    this.service.save(user).subscribe({
      next: (response) => {
        this.display = { success: response.message, errors: [] };
        console.log('Account created successfully:', response.message);
        this.changeDetection.markForCheck();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error creating account:', err);
        let errors: string[];
        if (user.password !== user.passwordConfirmed) {
          errors = ['Palavra passe de confirmação não pode ser diferente da palavra passe.'];
        } else if (Array.isArray(err.error?.errors)) {
          errors = err.error.errors;
        } else {
          errors = [err.error?.errors || 'Erro ao criar conta.'];
        }
        this.display = { success: '', errors };
        this.changeDetection.markForCheck();
      }
    });
  }

}
