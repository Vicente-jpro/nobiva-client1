import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubscriptionService } from '../../service/subscription-service';
import { PlanService } from '../../service/plan-service';
import { SubscriptionModel } from '../../models/subscription';
import { PlanModel } from '../../models/plan';
import { DisplayMessage } from '../../models/display-message';
import { Success } from '../../alerts/success/success';
import { Danger } from '../../alerts/danger/danger';

@Component({
  selector: 'app-my-subscription',
  imports: [FormsModule, DecimalPipe, Success, Danger],
  templateUrl: './my-subscription.html',
  styleUrl: './my-subscription.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MySubscription implements OnInit {
  private subscriptionService = inject(SubscriptionService);
  private planService = inject(PlanService);
  private cdr = inject(ChangeDetectorRef);

  subscription = signal<SubscriptionModel | null>(null);
  availablePlans = signal<PlanModel[]>([]);
  loading = signal(true);
  saving = signal(false);
  display = new DisplayMessage();
  showChangePlan = signal(false);

  planTypeIcon: Partial<Record<string, string>> = {
    MENSAL: 'bi-calendar-month',
    TRIMESTRAL: 'bi-calendar3',
    SEMESTRAL: 'bi-calendar2-range',
    ANUAL: 'bi-trophy',
  };

  planTypeDays: Partial<Record<string, number>> = {
    MENSAL: 30,
    TRIMESTRAL: 90,
    SEMESTRAL: 180,
    ANUAL: 365,
  };

  planTypeColor: Partial<Record<string, string>> = {
    MENSAL: 'info',
    TRIMESTRAL: 'success',
    SEMESTRAL: 'warning',
    ANUAL: 'nobiva',
  };

  statusBadge: Partial<Record<string, string>> = {
    ATIVO: 'success',
    EXPIRADO: 'danger',
    EM_AVALIACAO: 'warning',
  };

  statusLabel: Partial<Record<string, string>> = {
    ATIVO: 'Ativo',
    EXPIRADO: 'Expirado',
    EM_AVALIACAO: 'Em Avaliação',
  };

  ngOnInit(): void {
    this.loadSubscription();
    this.loadPlans();
  }

  loadSubscription(): void {
    this.subscriptionService.findByUser().subscribe({
      next: (sub) => {
        this.subscription.set(sub);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.subscription.set(null);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  loadPlans(): void {
    this.planService.findAll().subscribe({
      next: (plans) => {
        this.availablePlans.set(plans);
        this.cdr.markForCheck();
      },
      error: () => {},
    });
  }

  get progressPercent(): number {
    const sub = this.subscription();
    if (!sub || !sub.maxDuration) return 0;
    return Math.min(100, Math.round((sub.usedDays / sub.maxDuration) * 100));
  }

  get remainingDays(): number {
    const sub = this.subscription();
    if (!sub) return 0;
    return Math.max(0, sub.maxDuration - sub.usedDays);
  }

  selectPlan(plan: PlanModel): void {
    this.saving.set(true);
    this.display = new DisplayMessage();

    const sub = this.subscription();

    if (sub) {
      // already has subscription → update
      this.subscriptionService.update({ PlanType: plan }).subscribe({
        next: (msg) => {
          this.display = { success: msg || 'Plano atualizado com sucesso.', errors: [] };
          this.saving.set(false);
          this.showChangePlan.set(false);
          this.loadSubscription();
        },
        error: (err) => {
          this.display = { success: '', errors: err.error?.errors ?? ['Erro ao atualizar plano.'] };
          this.saving.set(false);
          this.cdr.markForCheck();
        },
      });
    } else {
      // no subscription → create
      this.subscriptionService.subscribe(plan).subscribe({
        next: (msg) => {
          this.display = { success: msg || 'Plano ativado com sucesso.', errors: [] };
          this.saving.set(false);
          this.showChangePlan.set(false);
          this.loadSubscription();
        },
        error: (err) => {
          this.display = { success: '', errors: err.error?.errors ?? ['Erro ao subscrever plano.'] };
          this.saving.set(false);
          this.cdr.markForCheck();
        },
      });
    }
  }
}
