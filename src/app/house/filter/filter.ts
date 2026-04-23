import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dashboard } from '../../dashboard/dashboard';
import { StatusPost } from '../../models/property-status';
import { TypeNegotiation } from '../../models/negotiation-type';
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

  @Output() applyFilterEvent = new EventEmitter<void>();

  protected filterStatus = '';
  protected filterType = '';
  protected filterSearch = '';

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


}
