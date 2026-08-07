import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Danger } from '../../../alerts/danger/danger';
import { Success } from '../../../alerts/success/success';
import { DisplayMessage } from '../../../models/display-message';
import { EmailContactTask } from '../../../models/email-contact-task';
import { AuthService } from '../../../service/auth.service';
import { EmailContactTaskService } from '../../../service/email-contact-task';

@Component({
  selector: 'app-property-contact-form',
  imports: [ReactiveFormsModule, Success, Danger],
  templateUrl: './property-contact-form.html',
  styleUrl: './property-contact-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyContactForm implements OnInit {
  static readonly DEFAULT_MESSAGE =
    'Olá, tenho interesse neste imóvel e gostaria de receber mais informações. ' +
    'Poderia, por favor, entrar em contacto comigo? Obrigado.';

  @Input() ownerEmail = '';
  @Input() houseId = '';
  @Input() roomId = '';

  private readonly formBuilder = inject(FormBuilder);
  private readonly service = inject(EmailContactTaskService);
  protected readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly saving = signal(false);
  protected display = new DisplayMessage();

  readonly contactForm = this.formBuilder.nonNullable.group({
    clientEmail: ['', [Validators.required, Validators.email]],
    message: [PropertyContactForm.DEFAULT_MESSAGE, [Validators.required]],
  });

  ngOnInit(): void {
    this.contactForm.controls.clientEmail.setValue(this.authService.getEmail() ?? '');
  }

  protected get emailError(): string {
    const email = this.contactForm.controls.clientEmail;
    if (email.hasError('required')) return 'O email é obrigatório.';
    if (email.hasError('email')) return 'Introduza um email válido.';
    return '';
  }

  protected get messageError(): string {
    return this.contactForm.controls.message.hasError('required')
      ? 'A descrição é obrigatória.'
      : '';
  }

  onSubmit(): void {
    if (!this.authService.isLoggedIn()) {
      this.display = { success: '', errors: ['Inicie sessão para contactar o proprietário.'] };
      this.cdr.markForCheck();
      return;
    }

    if (!this.ownerEmail) {
      this.display = {
        success: '',
        errors: ['Os dados de contacto do proprietário não estão disponíveis.'],
      };
      this.cdr.markForCheck();
      return;
    }

    if (this.contactForm.invalid || this.saving()) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const value = this.contactForm.getRawValue();
    const message = Object.assign(new EmailContactTask(), {
      ownerEmail: this.ownerEmail,
      clientEmail: value.clientEmail.trim(),
      message: value.message.trim(),
      houseId: this.houseId,
      roomId: this.roomId,
    });

    this.saving.set(true);
    this.display = new DisplayMessage();
    this.service.send(message).subscribe({
      next: (response) => {
        this.display = { success: response.message, errors: [] };
        this.contactForm.controls.message.setValue(PropertyContactForm.DEFAULT_MESSAGE);
        this.saving.set(false);
        this.cdr.markForCheck();
      },
      error: (errorResponse) => {
        const errors = errorResponse?.error?.errors;
        this.display = {
          success: '',
          errors: Array.isArray(errors) && errors.length
            ? errors
            : ['Não foi possível enviar a mensagem. Tente novamente.'],
        };
        this.saving.set(false);
        this.cdr.markForCheck();
      },
    });
  }
}
