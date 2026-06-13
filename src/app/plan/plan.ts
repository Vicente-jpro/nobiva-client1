import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { PlanService } from '../service/plan-service';
import { PlanModel } from '../models/plan';
import { DisplayMessage } from '../models/display-message';
import { Success } from '../alerts/success/success';
import { Danger } from '../alerts/danger/danger';

@Component({
  selector: 'app-plan',
  imports: [FormsModule, DecimalPipe, Success, Danger],
  templateUrl: './plan.html',
  styleUrl: './plan.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanManagement implements OnInit {
  private planService = inject(PlanService);
  private cdr = inject(ChangeDetectorRef);

  plans = signal<PlanModel[]>([]);
  loading = signal(false);
  saving = signal(false);
  display = new DisplayMessage();

  showModal = signal(false);
  editMode = signal(false);
  deleteTargetId = signal<string | null>(null);
  showDeleteModal = signal(false);

  form: PlanModel = new PlanModel();

  readonly planTypes = ['MENSAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL'];

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

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.loading.set(true);
    this.planService.findAll().subscribe({
      next: (data) => {
        this.plans.set(data);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.display = { success: '', errors: err.error.errors || ['Erro ao carregar planos.'] };
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  openCreate(): void {
    this.form = new PlanModel();
    this.editMode.set(false);
    this.display = new DisplayMessage();
    this.showModal.set(true);
    this.cdr.markForCheck();
  }

  openEdit(plan: PlanModel): void {
    this.form = { ...plan };
    this.editMode.set(true);
    this.display = new DisplayMessage();
    this.showModal.set(true);
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.showModal.set(false);
    this.cdr.markForCheck();
  }

  onSubmit(): void {
    this.saving.set(true);
    this.display = new DisplayMessage();
    const action = this.editMode()
      ? this.planService.update(this.form.id, this.form)
      : this.planService.save(this.form);

    action.subscribe({
      next: () => {
        this.display = {
          success: this.editMode() ? 'Plano atualizado com sucesso.' : 'Plano criado com sucesso.',
          errors: [],
        };
        this.saving.set(false);
        this.showModal.set(false);
        this.loadPlans();
      },
      error: (err) => {
        this.display = { success: '', errors: err.error.errors || ['Ocorreu um erro ao salvar.'] };
        this.saving.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  confirmDelete(id: string): void {
    this.deleteTargetId.set(id);
    this.showDeleteModal.set(true);
    this.cdr.markForCheck();
  }

  cancelDelete(): void {
    this.deleteTargetId.set(null);
    this.showDeleteModal.set(false);
    this.cdr.markForCheck();
  }

  doDelete(): void {
    const id = this.deleteTargetId();
    if (!id) return;
    this.planService.delete(id).subscribe({
      next: () => {
        this.display = { success: 'Plano eliminado com sucesso.', errors: [] };
        this.showDeleteModal.set(false);
        this.loadPlans();
      },
      error: (err) => {
        this.display = { success: '', errors: err.error.errors || ['Erro ao eliminar.'] };
        this.showDeleteModal.set(false);
        this.cdr.markForCheck();
      },
    });
  }
}
