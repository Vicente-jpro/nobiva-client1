import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, Validators, ReactiveFormsModule, FormBuilder} from '@angular/forms';


import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { EmailContactTask } from '../models/email-contact-task';
import { EmailContactTaskService } from '../service/email-contact-task';
import { DisplayMessage } from '../models/display-message';


@Component({
  selector: 'app-dialog-email-message',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './dialog-email-message.html',
  styleUrl: './dialog-email-message.scss',
})
export class DialogEmailMessage {
  readonly dialog = inject(MatDialog);

  @Input() houseIdData: string = '';

  @Input() roomIdData: string = '';

  protected message = new DisplayMessage();

  openDialog() {
    this.dialog.open(DialogElementsExampleDialog, { 
      data: { 
        houseId: this.houseIdData, 
        roomId: this.roomIdData 
      } });
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
  private data = inject<{ houseId: string, roomId: string }>(MAT_DIALOG_DATA);
  private emailContactTask = new EmailContactTask();
  private service = inject(EmailContactTaskService);
  protected displayMessage = new DisplayMessage();

  contactForm = this.formBuilder.group({
    clientEmail: ['', [Validators.required, Validators.email]],
    message: ['Olá, estou interessado no imóvel e gostaria de obter mais informações.', 
      [Validators.required]]
  });

  getEmailError(): string {
    const email = this.contactForm.get('ownerEmail');
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
    this.emailContactTask = this.contactForm.value as EmailContactTask;

    if (this.data.houseId) {
        this.emailContactTask.houseId = this.data.houseId;
    }else if (this.data.roomId) {
       this.emailContactTask.roomId = this.data.roomId; 
    }
    this.sendEmail(this.emailContactTask);

    //console.log('Form Data:', this.data);
    //console.log('Form Values:', this.emailContactTask);
  }

  sendEmail(message: EmailContactTask): void {
    console.log('Sending email with data:', message);
    this.service.send(message).subscribe({
      next: (response) => {
        this.displayMessage.success = response.message;
      },
      error: (errorResponse) => {
        this.displayMessage.errors = errorResponse.error.errors;
        console.error('Erro ao enviar email:', errorResponse.error.errors);
      }
    });
  }
}