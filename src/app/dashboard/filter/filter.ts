import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dashboard } from '../../dashboard/dashboard';
import { StatusPost } from '../../models/property-status';
import { TypeNegotiation } from '../../models/negotiation-type';
import { Tipology } from '../../models/property-tipology';
import { HouseService } from '../../service/house-service';
import { AuthService } from '../../service/auth.service';
import { HouseResponse } from '../../models/house/house-response';

@Component({
  selector: 'app-filter',
  imports: [FormsModule],
  templateUrl: './filter.html',
})
export class Filter implements OnInit {

  
  private houseService = inject(HouseService);
  protected authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  protected houses = signal<HouseResponse[]>([]);
  protected filteredHouses = signal<HouseResponse[]>([]);

  protected loading = false;
  protected actionMessage = '';
  protected actionError = '';
  protected page = 0;

  statusPost = StatusPost;
  negotiation = TypeNegotiation;
  tipology = Tipology;
  tipologyKeys = Object.values(Tipology);

  @Output() applyFilterEvent = new EventEmitter<void>();

  protected filterStatus = '';
  protected filterType = '';
  protected filterSearch = '';
  protected filterMinPrice: number | null = null;
  protected filterMaxPrice: number | null = null;
  protected filterTipologies: string[] = [];

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

    if (this.filterMinPrice !== null && this.filterMinPrice !== undefined) {
      result = result.filter(h => h.price >= this.filterMinPrice!);
    }

    if (this.filterMaxPrice !== null && this.filterMaxPrice !== undefined) {
      result = result.filter(h => h.price <= this.filterMaxPrice!);
    }

    if (this.filterTipologies.length > 0) {
      result = result.filter(h => this.filterTipologies.includes(h.tipology));
    }

    this.filteredHouses.set(result);
  }

  toggleTipology(value: string): void {
    const idx = this.filterTipologies.indexOf(value);
    if (idx === -1) {
      this.filterTipologies = [...this.filterTipologies, value];
    } else {
      this.filterTipologies = this.filterTipologies.filter(t => t !== value);
    }
    this.cdr.markForCheck();
  }


}
