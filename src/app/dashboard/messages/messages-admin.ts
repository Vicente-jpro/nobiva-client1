import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { publicApiErrors } from '../../models/api-error';
import {
  ClientMessageResponse,
  MessageStatus,
  PageResponse,
} from '../../models/client-message';
import { ClientMessageService } from '../../service/client-message-service';

@Component({
  selector: 'app-messages-admin',
  imports: [DatePipe],
  templateUrl: './messages-admin.html',
  styleUrl: './messages-admin.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesAdmin implements OnInit {
  private readonly service = inject(ClientMessageService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly messages = signal<ClientMessageResponse[]>([]);
  protected readonly selected = signal<ClientMessageResponse | null>(null);
  protected readonly loading = signal(false);
  protected readonly retryingId = signal<string | null>(null);
  protected readonly error = signal('');
  protected readonly success = signal('');
  protected readonly page = signal(0);
  protected readonly pageSize = signal(10);
  protected readonly totalElements = signal(0);
  protected readonly totalPages = signal(0);

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

  protected load(page: number): void {
    if (this.loading() || page < 0 || (this.totalPages() > 0 && page >= this.totalPages())) return;

    this.loading.set(true);
    this.error.set('');
    this.service.findAll(page, this.pageSize()).pipe(
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
    const size = Number((event.target as HTMLSelectElement).value);
    if (![10, 20, 50].includes(size)) return;
    this.pageSize.set(size);
    this.totalPages.set(0);
    this.load(0);
  }

  protected open(message: ClientMessageResponse): void {
    this.selected.set(message);
  }

  protected close(): void {
    if (this.retryingId()) return;
    this.selected.set(null);
  }

  protected retry(message: ClientMessageResponse): void {
    if (message.status !== 'FALHADO' || this.retryingId()) return;

    this.retryingId.set(message.id);
    this.error.set('');
    this.success.set('');
    this.service.retry(message.id).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.retryingId.set(null)),
    ).subscribe({
      next: updated => {
        this.messages.update(items => items.map(item => item.id === updated.id ? updated : item));
        if (this.selected()?.id === updated.id) this.selected.set(updated);
        this.success.set('Mensagem colocada novamente na fila de processamento.');
      },
      error: (httpError: HttpErrorResponse) => {
        this.error.set(publicApiErrors(httpError, 'Não foi possível reprocessar a mensagem.')[0]);
      },
    });
  }

  protected statusLabel(status: MessageStatus): string {
    const labels: Record<MessageStatus, string> = {
      PENDENTE: 'Pendente',
      PUBLICADO: 'Publicado',
      PROCESSADO: 'Processado',
      FALHADO: 'Falhado',
    };
    return labels[status];
  }

  protected statusClass(status: MessageStatus): string {
    const classes: Record<MessageStatus, string> = {
      PENDENTE: 'text-bg-warning',
      PUBLICADO: 'text-bg-info',
      PROCESSADO: 'text-bg-success',
      FALHADO: 'text-bg-danger',
    };
    return classes[status];
  }

  private setPage(response: PageResponse<ClientMessageResponse>): void {
    this.messages.set(response.content);
    this.page.set(response.number);
    this.pageSize.set(response.size);
    this.totalElements.set(response.totalElements);
    this.totalPages.set(response.totalPages);
  }
}
