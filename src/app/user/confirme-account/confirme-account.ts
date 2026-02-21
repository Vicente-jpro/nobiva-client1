import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAnchor } from "@angular/material/button";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { UserService } from '../service/user-service';
import { UserEmail } from '../model/UserEmail';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessage } from '../../dialog-message/dialog-message';

@Component({
  selector: 'app-confirme-account',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatAnchor,
    RouterLink
  ],
  templateUrl: './confirme-account.html',
  styleUrl: './confirme-account.scss',
})
export class ConfirmeAccount implements OnInit {

  private token: string = '';
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(UserService);
  private dialog = inject(MatDialog);
  private formBuilder = inject(FormBuilder);

  private dialogTitleData: string = '';
  private dialogContentData: string = '';

    user: UserEmail = { email: '' }

  confimeAccountForm = this.formBuilder.group({
    email: [this.user.email, [Validators.required, Validators.email]],
  });

  openDialog() {
    this.dialog.open(DialogMessage, {
      data: {
        title: this.dialogTitleData,
        content: this.dialogContentData
      }
    });
  }

  ngOnInit(): void {
     this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (this.token) {
      
     console.log("Token for account confirmation:", this.token);
      this.service.confimeAccount(this.token).subscribe({
        next: (response) => {
         
          this.dialogTitleData = "Conta Ativada";
          this.dialogContentData = response.message;

           this.router.navigate(['/user/login']);

          this.openDialog();
        },
        error: (errorResponse) => {
          this.dialogTitleData = "Erro ao confirmar a conta";
          this.dialogContentData = errorResponse.error.details || "Ocorreu um erro ao confirmar a conta. Por favor, tente novamente.";
          this.openDialog();
          console.error("Erro ao confirmar a conta", errorResponse);
        }
      });
    }
  }

  onSubmit() {

  }


}
