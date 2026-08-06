import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PlanModel } from '../../../models/plan';

@Component({
  selector: 'app-plan-card',
  imports: [DecimalPipe],
  templateUrl: './plan-card.html',
  styleUrl: './plan-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanCard {
  readonly plan = input.required<PlanModel>();
  readonly active = input(false);

  readonly planTypeIcon: Partial<Record<string, string>> = {
    MENSAL: 'bi-calendar-month',
    TRIMESTRAL: 'bi-calendar3',
    SEMESTRAL: 'bi-calendar2-range',
    ANUAL: 'bi-trophy',
  };

  readonly planTypeDays: Partial<Record<string, number>> = {
    MENSAL: 30,
    TRIMESTRAL: 90,
    SEMESTRAL: 180,
    ANUAL: 365,
  };

  readonly planTypeColor: Partial<Record<string, string>> = {
    MENSAL: 'info',
    TRIMESTRAL: 'success',
    SEMESTRAL: 'warning',
    ANUAL: 'nobiva',
  };
}
