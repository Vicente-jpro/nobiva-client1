import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SubscriptionService } from '../../service/subscription-service';
import { SubscriptionModel, SubscriptionRequest } from '../../models/subscription';
import { DisplayMessage } from '../../models/display-message';
import { Success } from '../../alerts/success/success';
import { Danger } from '../../alerts/danger/danger';

@Component({
  selector: 'app-subscriptions-admin',
  imports: [FormsModule, Success, Danger],
  templateUrl: './subscriptions-admin.html',
  styleUrl: './subscriptions-admin.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionsAdmin implements OnInit {
  private service = inject(SubscriptionService);
  private cdr = inject(ChangeDetectorRef);

  subscriptions = signal<SubscriptionModel[]>([]);
  loading = signal(true);
  display = new DisplayMessage();
  activating = signal<string | null>(null);

  selectedStatus = 'EM_AVALIACAO';
  readonly statuses = [
    { value: 'EM_AVALIACAO', label: 'Em Avaliação' },
    { value: 'ATIVO', label: 'Ativos' },
    { value: 'EXPIRADO', label: 'Expirados' },
  ];

  statusBadge: Partial<Record<string, string>> = {
    ATIVO: 'success',
    EXPIRADO: 'danger',
    EM_AVALIACAO: 'warning',
  };

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.display = new DisplayMessage();
    this.service.findByStatus(this.selectedStatus).subscribe({
      next: (data) => {
        this.subscriptions.set(data);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.display = { success: '', errors: err.error?.errors ?? ['Erro ao carregar subscrições.'] };
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  activate(sub: SubscriptionModel): void {
    const userId = sub.user?.id;
    if (!userId) return;

    this.activating.set(sub.id);
    const req: SubscriptionRequest = { userId };

    this.service.activate(userId, req).subscribe({
      next: (msg) => {
        this.display = { success: msg || 'Plano ativado com sucesso.', errors: [] };
        this.activating.set(null);
        this.load();
      },
      error: (err) => {
        this.display = { success: '', errors: err.error?.errors ?? ['Erro ao ativar subscrição.'] };
        this.activating.set(null);
        this.cdr.markForCheck();
      },
    });
  }
}
