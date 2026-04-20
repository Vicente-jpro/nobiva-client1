import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { EmailContactTask } from '../models/email-contact-task';
import { EmailContactTaskService } from '../service/email-contact-task';
import { DisplayMessage } from '../models/display-message';
import { AuthService } from '../service/auth.service';
import { HouseResponse } from '../models/house/house-response';
import { RoomResponse } from '../models/room/room-response';
import { Danger } from '../alerts/danger/danger';
import { Success } from '../alerts/success/success';


@Component({
  selector: 'app-dialog-email-message',
  imports: [FormsModule, ReactiveFormsModule, Success, Danger],
  templateUrl: './dialog-email-message.html',
  styleUrl: './dialog-email-message.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogEmailMessage {

  @Input() houseData = new HouseResponse();
  @Input() roomData = new RoomResponse();

  private formBuilder = inject(FormBuilder);
  private emailContactTask = new EmailContactTask();
  private service = inject(EmailContactTaskService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  protected display = new DisplayMessage();
  protected modalVisible = false;

  userService = inject(AuthService);

  contactForm = this.formBuilder.group({
    clientEmail: ['', [Validators.required, Validators.email]],
    message: ['Olá, estou interessado no imóvel e gostaria de obter mais informações.',
      [Validators.required]]
  });

  openModal(): void {
    this.modalVisible = true;
  }

  closeModal(): void {
    this.modalVisible = false;
  }

  getEmailError(): string {
    const email = this.contactForm.get('clientEmail');
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
    if (this.contactForm.invalid) return;

    this.emailContactTask = this.contactForm.value as EmailContactTask;
    this.emailContactTask.ownerEmail = this.houseData.email;

    if (this.houseData.idHouse) {
      this.emailContactTask.houseId = this.houseData.idHouse;
    } else if (this.roomData.idRoom) {
      this.emailContactTask.roomId = this.roomData.idRoom;
    }

    this.sendEmail(this.emailContactTask);
  }

  sendEmail(message: EmailContactTask): void {
    this.service.send(message).subscribe({
      next: (response) => {
        this.display.success = response.message;
        this.display.errors = [];
        this.changeDetectorRef.markForCheck();
      },
      error: (errorResponse) => {
        this.display.errors = errorResponse.error.errors;
        this.display.success = '';
        this.changeDetectorRef.markForCheck();
      }
    });
  }
}