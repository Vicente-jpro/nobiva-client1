import { DatePipe, DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, TemplateRef } from '@angular/core';
import { HouseResponse } from '../../../models/house/house-response';
import { PlanStatus } from '../../../models/plan-status';
import { StatusPost } from '../../../models/property-status';

export interface HouseTableActionContext {
  $implicit: HouseResponse;
  house: HouseResponse;
}

@Component({
  selector: 'app-house-table',
  imports: [DatePipe, DecimalPipe, NgTemplateOutlet],
  templateUrl: './house-table.html',
  styleUrl: './house-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HouseTable {
  readonly houses = input.required<HouseResponse[]>();
  readonly actionsTemplate = input<TemplateRef<HouseTableActionContext> | null>(null);
  readonly emptyMessage = input('Nenhum imóvel encontrado.');

  getStatusBadge(status: string): string {
    switch (status) {
      case StatusPost.APROVADO: return 'text-bg-success';
      case StatusPost.REPROVADO: return 'text-bg-danger';
      case StatusPost.BLOQUEADO: return 'text-bg-secondary';
      default: return 'text-bg-warning';
    }
  }

  getSubscriptionStatusBadge(status: string): string {
    switch (status) {
      case PlanStatus.ATIVO: return 'text-bg-success';
      case PlanStatus.EXPIRADO: return 'text-bg-danger';
      case PlanStatus.EM_AVALIACAO: return 'text-bg-warning';
      default: return 'text-bg-secondary';
    }
  }
}
