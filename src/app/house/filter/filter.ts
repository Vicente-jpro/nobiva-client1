import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StatusPost } from '../../models/property-status';
import { TypeNegotiation } from '../../models/negotiation-type';
import { Tipology } from '../../models/property-tipology';
import { HouseService } from '../../service/house-service';
import { AuthService } from '../../service/auth.service';
import { HouseFilter } from '../../models/house/house-filter';

@Component({
  selector: 'app-filter',
  imports: [FormsModule],
  templateUrl: './filter.html',
})
export class Filter implements OnInit {

  private houseService = inject(HouseService);
  protected authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  protected loading = false;
  protected page = 0;

  statusPost = StatusPost;
  negotiation = TypeNegotiation;
  tipology = Tipology;
  tipologyKeys = Object.values(Tipology);

  @Output() applyFilterEvent = new EventEmitter<HouseFilter>();

  
  protected filterStatus = '';
  protected filterTypeNegociation = '';
  protected filterSearch = '';
  protected filterMinPrice: number | null = null;
  protected filterMaxPrice: number | null = null;
  protected filterTipologies: string[] = [];

  protected houseFilter = HouseFilter.builder();
  

  ngOnInit(): void {
    this.houseFilter.setNegotiation(this.negotiation.ARRENDAMENTO);
    
    this.loadHouses();
  }

  loadHouses(): void {
    this.loading = true;
  }



  applyFilter(): void {

    const filter = HouseFilter.builder()
      .setTitle(this.filterSearch)
      .setNegotiation(this.filterTypeNegociation)
      .setStatusPost(this.filterStatus)
      .setLocality(this.filterSearch)
      .setMinPrice(this.filterMinPrice ?? 100)
      .setMaxPrice(this.filterMaxPrice ?? 900000000)
      .build();

    this.houseFilter = HouseFilter.builder();
    this.applyFilterEvent.emit(filter);
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
