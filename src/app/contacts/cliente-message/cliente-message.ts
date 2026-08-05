import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { publicApiErrors } from '../../models/api-error';
import { ClientMessageRequest } from '../../models/client-message';
import { ClientMessageService } from '../../service/client-message-service';

type SendState = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'app-cliente-message',
  imports: [ReactiveFormsModule],
  templateUrl: './cliente-message.html',
  styleUrl: './cliente-message.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteMessage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly clientMessageService = inject(ClientMessageService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly submitted = signal(false);
  protected readonly state = signal<SendState>('idle');
  protected readonly feedback = signal('');

  protected readonly messageForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    subject: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]],
  });

  protected isInvalid(controlName: keyof typeof this.messageForm.controls): boolean {
    const control = this.messageForm.controls[controlName];
    return control.invalid && (control.touched || this.submitted());
  }

  protected send(): void {
    if (this.state() === 'sending') return;

    this.submitted.set(true);
    this.feedback.set('');
    this.messageForm.markAllAsTouched();
    if (this.messageForm.invalid) return;

    const value = this.messageForm.getRawValue();
    const request: ClientMessageRequest = {
      email: value.email.trim(),
      subject: value.subject.trim(),
      description: value.description.trim(),
    };

    this.state.set('sending');
    this.messageForm.disable({ emitEvent: false });
    this.clientMessageService.send(request).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.messageForm.enable({ emitEvent: false })),
    ).subscribe({
      next: response => {
        this.state.set('success');
        this.feedback.set(response.message || 'A sua mensagem foi enviada com sucesso.');
        this.messageForm.reset();
        this.submitted.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.state.set('error');
        this.feedback.set(publicApiErrors(error, 'Não foi possível enviar a mensagem. Tente novamente.')[0]);
      },
    });
  }
}
