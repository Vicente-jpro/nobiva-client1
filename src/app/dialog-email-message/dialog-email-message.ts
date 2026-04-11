import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, signal } from '@angular/core';
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
import { AuthService } from '../service/auth.service';
import { HouseResponse } from '../models/house/house-response';
import { RoomResponse } from '../models/room/room-response';


@Component({
  selector: 'app-dialog-email-message',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './dialog-email-message.html',
  styleUrl: './dialog-email-message.scss',
})
export class DialogEmailMessage {
  readonly dialog = inject(MatDialog);

  @Input() houseData = new HouseResponse();

  @Input() roomData = new RoomResponse();

  protected message = new DisplayMessage();

  openDialog() {
    this.dialog.open(DialogElementsExampleDialog, { 
      data: { 
        house: this.houseData,
        room: this.roomData,

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
  private data = inject<{ house: HouseResponse, room: RoomResponse }>(MAT_DIALOG_DATA);
  private emailContactTask = new EmailContactTask();
  private service = inject(EmailContactTaskService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  protected display = new DisplayMessage();
  userService = inject(AuthService);

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

    this.emailContactTask.ownerEmail = this.data.house.email;

    if (this.data.house.idHouse) {
        this.emailContactTask.houseId = this.data.house.idHouse;
    }else if (this.data.room.idRoom) {
       this.emailContactTask.roomId = this.data.room.idRoom; 
    }

    this.sendEmail(this.emailContactTask);

  }

  sendEmail(message: EmailContactTask): void {
    console.log('Sending email with data:', message);
    this.service.send(message).subscribe({
      next: (response) => {
        this.display.success = response.message;
        this.changeDetectorRef.markForCheck();
      },
      error: (errorResponse) => {
        this.display.errors = errorResponse.error.errors;
        this.changeDetectorRef.markForCheck();
        console.error('Erro ao enviar email:', errorResponse.error.errors);
      }
    });
  }
}