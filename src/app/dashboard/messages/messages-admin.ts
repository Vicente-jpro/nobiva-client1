import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import {
  ConversationDetailResponse,
  ConversationStatus,
  ConversationSummaryResponse,
  PageResponse,
} from '../../models/client-message';
import { publicApiErrors } from '../../models/api-error';
import { ClientMessageService } from '../../service/client-message-service';

@Component({
  selector: 'app-messages-admin',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './messages-admin.html',
  styleUrl: './messages-admin.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesAdmin implements OnInit {
  private readonly service = inject(ClientMessageService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly messages = signal<ConversationSummaryResponse[]>([]);
  protected readonly selected = signal<ConversationDetailResponse | null>(null);
  protected readonly loading = signal(false);
  protected readonly loadingDetail = signal(false);
  protected readonly replying = signal(false);
  protected readonly error = signal('');
  protected readonly replyError = signal('');
  protected readonly success = signal('');
  protected readonly page = signal(0);
  protected readonly pageSize = signal(10);
  protected readonly totalElements = signal(0);
  protected readonly totalPages = signal(0);

  protected readonly filterForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.email, Validators.maxLength(254)]],
    estado: ['' as ConversationStatus | ''],
  });

  protected readonly replyForm = this.formBuilder.nonNullable.group({
    conteudo: ['', [Validators.required, Validators.maxLength(5000)]],
  });

  protected readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.page();
    const start = Math.max(0, Math.min(current - 2, total - 5));
    return Array.from({ length: Math.min(5, total) }, (_, index) => start + index);
  });

  protected readonly firstResult = computed(() =>
    this.totalElements() === 0 ? 0 : this.page() * this.pageSize() + 1,
  );

  protected readonly lastResult = computed(() =>
    Math.min((this.page() + 1) * this.pageSize(), this.totalElements()),
  );

  ngOnInit(): void {
    this.load(0);
  }

  protected applyFilters(): void {
    this.filterForm.markAllAsTouched();
    if (this.filterForm.invalid) return;
    this.load(0);
  }

  protected clearFilters(): void {
    this.filterForm.reset({ email: '', estado: '' });
    this.load(0);
  }

  protected load(page: number): void {
    if (page < 0 || (this.totalPages() > 0 && page >= this.totalPages())) return;

    const filters = this.filterForm.getRawValue();
    this.loading.set(true);
    this.error.set('');
    this.service.findAll(page, this.pageSize(), {
      ...(filters.estado ? { estado: filters.estado } : {}),
      ...(filters.email.trim() ? { email: filters.email.trim() } : {}),
    }).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: response => this.setPage(response),
      error: (httpError: HttpErrorResponse) => {
        this.messages.set([]);
        this.error.set(publicApiErrors(httpError, 'Não foi possível carregar as mensagens.')[0]);
      },
    });
  }

  protected changePageSize(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const size = Number(value);
    if (![10, 20, 50].includes(size)) return;
    this.pageSize.set(size);
    this.load(0);
  }

  protected open(message: ConversationSummaryResponse): void {
    this.loadingDetail.set(true);
    this.error.set('');
    this.success.set('');
    this.replyError.set('');
    this.service.findOne(message.id).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loadingDetail.set(false)),
    ).subscribe({
      next: detail => {
        this.selected.set(detail);
        this.replyForm.reset({ conteudo: '' });
        this.messages.update(items => items.map(item =>
          item.id === detail.id ? { ...item, naoLidas: 0 } : item,
        ));
      },
      error: (httpError: HttpErrorResponse) => {
        this.error.set(publicApiErrors(httpError, 'Não foi possível abrir a mensagem.')[0]);
      },
    });
  }

  protected close(): void {
    if (this.replying()) return;
    this.selected.set(null);
    this.replyError.set('');
    this.success.set('');
    this.replyForm.reset({ conteudo: '' });
  }

  protected reply(): void {
    const conversation = this.selected();
    if (!conversation || this.replying()) return;

    this.replyForm.markAllAsTouched();
    if (this.replyForm.invalid) return;

    const conteudo = this.replyForm.controls.conteudo.value.trim();
    if (!conteudo) {
      this.replyForm.controls.conteudo.setErrors({ required: true });
      return;
    }

    this.replying.set(true);
    this.replyError.set('');
    this.success.set('');
    this.replyForm.disable({ emitEvent: false });
    this.service.reply(conversation.id, { conteudo }).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.replying.set(false);
        this.replyForm.enable({ emitEvent: false });
      }),
    ).subscribe({
      next: response => {
        const updated = { ...conversation, estado: 'RESPONDIDA' as const,
          ultimaInteracaoEm: response.criadoEm, mensagens: [...conversation.mensagens, response] };
        this.selected.set(updated);
        this.messages.update(items => items.map(item => item.id === conversation.id
          ? { ...item, estado: 'RESPONDIDA', ultimaInteracaoEm: response.criadoEm,
              totalMensagens: item.totalMensagens + 1, naoLidas: 0 }
          : item));
        this.replyForm.reset({ conteudo: '' });
        this.success.set('Resposta enviada com sucesso.');
      },
      error: (httpError: HttpErrorResponse) => {
        this.replyError.set(publicApiErrors(httpError, 'Não foi possível enviar a resposta.')[0]);
      },
    });
  }

  protected statusLabel(status: ConversationStatus): string {
    const labels: Record<ConversationStatus, string> = {
      ABERTA: 'Aberta',
      RESPONDIDA: 'Respondida',
      AGUARDANDO_ADMIN: 'A aguardar resposta',
      ENCERRADA: 'Encerrada',
    };
    return labels[status];
  }

  protected statusClass(status: ConversationStatus): string {
    const classes: Record<ConversationStatus, string> = {
      ABERTA: 'text-bg-primary',
      RESPONDIDA: 'text-bg-success',
      AGUARDANDO_ADMIN: 'text-bg-warning',
      ENCERRADA: 'text-bg-secondary',
    };
    return classes[status];
  }

  protected authorIsStaff(authorType: string): boolean {
    return authorType === 'ADMINSTRADOR' || authorType === 'SUPER_ADMINSTRADOR';
  }

  private setPage(response: PageResponse<ConversationSummaryResponse>): void {
    this.messages.set(response.content);
    this.page.set(response.number);
    this.pageSize.set(response.size);
    this.totalElements.set(response.totalElements);
    this.totalPages.set(response.totalPages);
  }
}
