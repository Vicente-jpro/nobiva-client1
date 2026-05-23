import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HouseService } from '../service/house-service';
import { AuthService } from '../service/auth.service';
import { HouseResponse } from '../models/house/house-response';
import { StatusPost } from '../models/property-status';
import { TypeNegotiation } from '../models/negotiation-type';
import { DecimalPipe } from '@angular/common';
import { Filter } from '../house/filter/filter';
import { HouseFilter } from '../models/house/house-filter';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, RouterLink, DecimalPipe, Filter],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {

  private houseService = inject(HouseService);
  protected authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  protected houses = signal<HouseResponse[]>([]);

  protected loading = signal(false);
  protected actionMessage = '';
  protected actionError = '';
  protected page = signal(0);
  protected houseFilter = new HouseFilter();

  protected readonly StatusPost = StatusPost;
  protected readonly TypeNegotiation = TypeNegotiation;

  ngOnInit(): void {
    this.houseFilter.statusPost = StatusPost.PENDENTE;
    this.findByFilter(this.houseFilter, this.page());
  }

  loadHouses(): void {
    this.houses.set([]);
    this.page.set(0);
    this.findByFilter(this.houseFilter, this.page());
  }

  applyFilter(filter: HouseFilter): void {
    this.houses.set([]);
    this.houseFilter = filter;
    this.page.set(0);
    this.findByFilter(this.houseFilter, this.page());
  }

  goToNextPage(): void {
    this.page.update(p => p + 1);
    this.findByFilter(this.houseFilter, this.page());
  }

  private findByFilter(houseFilter: HouseFilter, pageNumber: number): void {
    this.loading.set(true);
    this.houseService.findByFilter(houseFilter, pageNumber).subscribe({
      next: (response) => {
        this.houses.update(current => [...current, ...response]);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading houses:', err);
        this.loading.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  approve(idHouse: string): void {
    this.houseService.approve(idHouse).subscribe({
      next: (res) => {
        this.actionMessage = res.message || 'Casa aprovada com sucesso.';
        this.actionError = '';
        this.loadHouses();
      },
      error: (err) => {
        this.actionError = 'Erro ao aprovar a casa.';
        this.actionMessage = '';
        this.cdr.markForCheck();
      }
    });
  }

  reject(idHouse: string): void {
    this.houseService.reject(idHouse).subscribe({
      next: (res) => {
        this.actionMessage = res.message || 'Casa reprovada.';
        this.actionError = '';
        this.loadHouses();
      },
      error: (err) => {
        this.actionError = 'Erro ao reprovar a casa.';
        this.actionMessage = '';
        this.cdr.markForCheck();
      }
    });
  }

  delete(idHouse: string): void {
    if (!confirm('Tem a certeza que deseja eliminar esta casa?')) return;

    this.houseService.delete(idHouse).subscribe({
      next: (res) => {
        this.actionMessage = res.message || 'Casa eliminada.';
        this.actionError = '';
        this.loadHouses();
      },
      error: (err) => {
        this.actionError = 'Erro ao eliminar a casa.';
        this.actionMessage = '';
        this.cdr.markForCheck();
      }
    });
  }

  prevPage(): void {
    if (this.page() > 0) {
      this.page.update(p => p - 1);
      this.houses.set([]);
      this.findByFilter(this.houseFilter, this.page());
    }
  }

  getStatusBadge(status: string): string {
    switch (status) {
      case StatusPost.APROVADO: return "text-bg-success";
      case StatusPost.REPROVADO: return "text-bg-danger";
      case StatusPost.BLOQUEADO: return "text-bg-secondary";
      default: return "text-bg-warning";
    }
  }


}
