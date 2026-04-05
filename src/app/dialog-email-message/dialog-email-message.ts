import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, Validators, ReactiveFormsModule, FormBuilder} from '@angular/forms';


import {merge} from 'rxjs';

import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-email-message',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './dialog-email-message.html',
  styleUrl: './dialog-email-message.scss',
})
export class DialogEmailMessage {
  readonly dialog = inject(MatDialog);

  @Input() propertyData: string = '';

  openDialog() {
    this.dialog.open(DialogElementsExampleDialog, { data: { propertyId: this.propertyData } });
  }
}


@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: './dialog-elements-example-dialog.html',
  imports: [
    MatDialogTitle, 
    MatDialogContent, 
    MatDialogActions, 
    MatDialogClose, 
    MatButtonModule,
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule,
    ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogElementsExampleDialog {

  private formBuilder = inject(FormBuilder);
  private data = inject<{ propertyId: string }>(MAT_DIALOG_DATA);

  contactForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    message: ['Olá, estou interessado no imóvel e gostaria de obter mais informações.', 
      [Validators.required]],
    propertyId: [this.data?.propertyId ?? '', [Validators.required]],
  });

  getEmailError(): string {
    const email = this.contactForm.get('email');
    if (email?.hasError('required')) return 'O email é obrigatório';
    if (email?.hasError('email')) return 'Insira um email válido';
    return '';
  }

  getMessageError(): string {
    const message = this.contactForm.get('message');
    if (message?.hasError('required')) return 'A mensagem é obrigatória';
    return '';
  }

  onSubmit() {
    console.log('Form Data:', this.data.propertyId);
  }
}