import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HouseService } from '../service/house-service';
import { AuthService } from '../service/auth.service';
import { HouseResponse } from '../models/house/house-response';
import { StatusPost } from '../models/property-status';
import { TypeNegotiation } from '../models/negotiation-type';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, RouterLink, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {

  private houseService = inject(HouseService);
  protected authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  protected houses = signal<HouseResponse[]>([]);
  protected filteredHouses = signal<HouseResponse[]>([]);

  protected loading = false;
  protected actionMessage = '';
  protected actionError = '';
  protected page = 0;

  protected filterStatus = '';
  protected filterType = '';
  protected filterSearch = '';

  protected readonly StatusPost = StatusPost;
  protected readonly TypeNegotiation = TypeNegotiation;

  ngOnInit(): void {
    this.loadHouses();
  }

  loadHouses(): void {
    this.loading = true;
    this.houseService.findAll(this.page).subscribe({
      next: (response) => {
        this.houses.set(response);
        this.applyFilter();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading houses:', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applyFilter(): void {
    let result = this.houses();

    if (this.filterStatus) {
      result = result.filter(h => h.status_post === this.filterStatus);
    }

    if (this.filterType) {
      result = result.filter(h => h.type_negotiation === this.filterType);
    }

    if (this.filterSearch.trim()) {
      const search = this.filterSearch.toLowerCase();
      result = result.filter(h =>
        h.title?.toLowerCase().includes(search) ||
        h.locality?.toLowerCase().includes(search) ||
        h.province?.toLowerCase().includes(search)
      );
    }

    this.filteredHouses.set(result);
    this.cdr.markForCheck();
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

  nextPage(): void {
    this.page++;
    this.loadHouses();
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadHouses();
    }
  }

  getStatusBadge(status: string): string {
    switch (status) {
      case StatusPost.APROVADO: return 'badge-aprovado';
      case StatusPost.PENDENTE: return 'badge-pendente';
      case StatusPost.REPROVADO: return 'badge-reprovado';
      case StatusPost.BLOQUEADO: return 'badge-bloqueado';
      default: return 'bg-secondary';
    }
  }
}
