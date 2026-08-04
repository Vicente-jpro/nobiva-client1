import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { UserEmail } from '../../models/user/UserEmail';
import { UserService } from '../../service/user-service';
import { DisplayMessage } from '../../models/display-message';
import { Success } from '../../alerts/success/success';
import { Danger } from '../../alerts/danger/danger';

@Component({
  selector: 'app-confirme-account',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    Success,
    Danger
  ],
  templateUrl: './confirme-account.html',
  styleUrl: './confirme-account.scss',
})
export class ConfirmeAccount implements OnInit {

  private token: string = '';
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private changeDetection = inject(ChangeDetectorRef);

  display = new DisplayMessage();

  user: UserEmail = { email: '' }

  confimeAccountForm = this.formBuilder.group({
    email: [this.user.email, [Validators.required, Validators.email]],
  });

  openDialog() {}

  ngOnInit(): void {
     this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

     
    if (this.token) {
      
      this.service.confimeAccount(this.token).subscribe({
        next: () => {
          this.router.navigate(['/user/account-confirmed']);
        },
        error: (errorResponse) => {
          this.changeDetection.markForCheck();
          this.display = { success: '', errors: errorResponse.error.errors || ['Ocorreu um erro ao confirmar a conta. Por favor, tente novamente.'] };
        }
      });
    }
  }

  onSubmit() {
    if (this.confimeAccountForm.invalid) {
      this.confimeAccountForm.markAllAsTouched();
      return;
    }

    this.user = this.confimeAccountForm.value as UserEmail;

    this.service.sendVerificationEmail(this.user).subscribe({
      next: (response) => {
        this.display = { success: response.message, errors: [] };
        this.changeDetection.markForCheck();
      },
      error: (errorResponse) => {
        this.display = { success: '', errors: errorResponse.error.errors || ['Ocorreu um erro ao enviar o email de verificação. Por favor, tente novamente.'] };
        this.changeDetection.markForCheck();
      }
    });
  }


}
