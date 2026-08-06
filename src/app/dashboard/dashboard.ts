import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HouseService } from '../service/house-service';
import { AuthService } from '../service/auth.service';
import { HouseResponse } from '../models/house/house-response';
import { StatusPost } from '../models/property-status';
import { Filter } from '../house/filter/filter';
import { HouseFilter } from '../models/house/house-filter';
import { DisplayMessage } from '../models/display-message';
import { Success } from '../alerts/success/success';
import { Danger } from '../alerts/danger/danger';
import { PlanManagement } from '../plan/plan';
import { SubscriptionsAdmin } from '../subscription/admin/subscriptions-admin';
import { MessagesAdmin } from './messages/messages-admin';
import { forkJoin } from 'rxjs';
import { HouseTable } from '../shared/components/house-table/house-table';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, RouterLink, Filter, Success, Danger, PlanManagement, SubscriptionsAdmin, MessagesAdmin, HouseTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {

  private houseService = inject(HouseService);
  protected authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private loadSequence = 0;

  protected houses = signal<HouseResponse[]>([]);

  protected activeView = signal<'houses' | 'plans' | 'subscriptions' | 'messages'>('houses');
  protected loading = signal(false);
  protected display = new DisplayMessage();
  protected page = signal(0);
  protected hasNext = signal(false);
  protected houseFilter = new HouseFilter();

  protected readonly StatusPost = StatusPost;

  ngOnInit(): void {
    if (this.router.url.startsWith('/dashboard/mensagens')) {
      this.activeView.set('messages');
      return;
    }
    this.houseFilter.statusPost = StatusPost.PENDENTE;
    this.loadPage(0);
  }

  setView(view: 'houses' | 'plans' | 'subscriptions'): void {
    this.activeView.set(view);
  }

  loadHouses(): void {
    this.houses.set([]);
    this.page.set(0);
    this.loadPage(0);
  }

  applyFilter(filter: HouseFilter): void {
    this.houses.set([]);
    this.houseFilter = filter;
    this.page.set(0);
    this.loadPage(0);
  }

  goToNextPage(): void {
    if (!this.hasNext() || this.loading()) return;
    this.loadPage(this.page() + 1);
  }

  private loadPage(pageNumber: number): void {
    if (pageNumber < 0) return;
    const request = ++this.loadSequence;
    this.loading.set(true);
    forkJoin({
      current: this.houseService.findByFilter(this.houseFilter, pageNumber),
      next: this.houseService.findByFilter(this.houseFilter, pageNumber + 1),
    }).subscribe({
      next: ({ current, next }) => {
        if (request !== this.loadSequence) return;
        if (current.length === 0 && pageNumber > 0) {
          this.loading.set(false);
          this.loadPage(pageNumber - 1);
          return;
        }
        this.houses.set(current);
        this.page.set(pageNumber);
        this.hasNext.set(next.length > 0);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        if (request !== this.loadSequence) return;
        this.display = { success: '', errors: err.error?.errors || ['Erro ao carregar imóveis.'] };
        this.loading.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  approve(idHouse: string): void {
    this.houseService.approve(idHouse).subscribe({
      next: (res) => {
        this.display = { success: res.message || 'Casa aprovada com sucesso.', errors: [] };
        this.loadPage(this.page());
      },
      error: (err) => {
        this.display = { success: '', errors: err.error.errors || ['Erro ao aprovar a casa.'] };
        this.cdr.markForCheck();
      }
    });
  }

  reject(idHouse: string): void {
    this.houseService.reject(idHouse).subscribe({
      next: (res) => {
        this.display = { success: res.message || 'Casa reprovada.', errors: [] };
        this.loadPage(this.page());
      },
      error: (err) => {
        this.display = { success: '', errors: err.error.errors || ['Erro ao reprovar a casa.'] };
        this.cdr.markForCheck();
      }
    });
  }

  delete(idHouse: string): void {
    if (!confirm('Tem a certeza que deseja eliminar esta casa?')) return;

    this.houseService.delete(idHouse).subscribe({
      next: (res) => {
        this.display = { success: res.message || 'Casa eliminada.', errors: [] };
        this.loadPage(this.page());
      },
      error: (err) => {
        this.display = { success: '', errors: err.error.errors || ['Erro ao eliminar a casa.'] };
        this.cdr.markForCheck();
      }
    });
  }

  prevPage(): void {
    if (this.page() > 0 && !this.loading()) this.loadPage(this.page() - 1);
  }
}
