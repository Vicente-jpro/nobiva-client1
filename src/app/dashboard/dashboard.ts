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
  protected filteredHouses = signal<HouseResponse[]>([]);

  protected loading = false;
  protected actionMessage = '';
  protected actionError = '';
  protected page = 0;

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

  applyFilter(){

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
      case StatusPost.APROVADO: return StatusPost.APROVADO;
      case StatusPost.PENDENTE: return StatusPost.PENDENTE;
      case StatusPost.REPROVADO: return StatusPost.REPROVADO;
      case StatusPost.BLOQUEADO: return StatusPost.BLOQUEADO;
      default: return 'bg-secondary';
    }
  }
}
