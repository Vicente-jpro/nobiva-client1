import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Danger } from '../../alerts/danger/danger';
import { Success } from '../../alerts/success/success';
import { DisplayMessage } from '../../models/display-message';
import { HouseResponse } from '../../models/house/house-response';
import { HouseService } from '../../service/house-service';
import { HouseTable } from '../../shared/components/house-table/house-table';

@Component({
  selector: 'app-my-publications',
  imports: [RouterLink, Success, Danger, HouseTable],
  templateUrl: './my-publications.html',
  styleUrl: './my-publications.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyPublications implements OnInit {
  private readonly houseService = inject(HouseService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly houses = signal<HouseResponse[]>([]);
  protected readonly page = signal(0);
  protected readonly hasNext = signal(false);
  protected readonly loading = signal(false);
  protected readonly deletingId = signal<string | null>(null);
  protected display = new DisplayMessage();

  ngOnInit(): void {
    this.loadPage(0);
  }

  protected loadPage(pageNumber: number): void {
    if (pageNumber < 0 || this.loading()) return;

    this.loading.set(true);
    forkJoin({
      current: this.houseService.findAllByOwner(pageNumber),
      next: this.houseService.findAllByOwner(pageNumber + 1),
    }).subscribe({
      next: ({ current, next }) => {
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
        this.display = {
          success: '',
          errors: err.error?.errors || ['Erro ao carregar as tuas publicações.'],
        };
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  protected deletePublication(house: HouseResponse): void {
    if (this.deletingId() || !confirm(`Eliminar a publicação "${house.title}"?`)) return;

    this.deletingId.set(house.idHouse);
    this.houseService.deleteOwned(house.idHouse).subscribe({
      next: () => {
        this.display = { success: 'Publicação eliminada com sucesso.', errors: [] };
        this.deletingId.set(null);
        this.loadPage(this.page());
      },
      error: (err) => {
        this.display = {
          success: '',
          errors: err.error?.errors || ['Erro ao eliminar a publicação.'],
        };
        this.deletingId.set(null);
        this.cdr.markForCheck();
      },
    });
  }
}
