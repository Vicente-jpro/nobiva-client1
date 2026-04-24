import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StatusPost } from '../../models/property-status';
import { TypeNegotiation } from '../../models/negotiation-type';
import { Tipology } from '../../models/property-tipology';
import { AuthService } from '../../service/auth.service';
import { HouseFilter } from '../../models/house/house-filter';
import { AddressService } from '../../service/address-service';
import { ProvinceSelectBox } from '../form/province-select-box';

@Component({
  selector: 'app-filter',
  imports: [FormsModule],
  templateUrl: './filter.html',
})
export class Filter extends ProvinceSelectBox implements OnInit {

  protected authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  protected loading = false;
  protected page = 0;

  statusPost = StatusPost;
  negotiation = TypeNegotiation;
  tipology = Tipology;
  tipologyKeys = Object.values(Tipology);

  @Output() applyFilterEvent = new EventEmitter<HouseFilter>();

  private addressService = inject(AddressService);
  protected filterStatus = '';
  protected filterTypeNegociation = '';
  protected filterSearch = '';
  protected filterMinPrice: number | null = null;
  protected filterMaxPrice: number | null = null;
  protected filterTipologies: string[] = [];
  protected filterIdProvince: number = 0;

  protected houseFilter = HouseFilter.builder();
  

  ngOnInit(): void {
    this.houseFilter.setNegotiation(this.negotiation.ARRENDAMENTO);
    this.addressService.findProvinces().subscribe({
      next: provinces => {
        this.provinceOptions = provinces.map(p => ({ value: p.id, viewValue: p.name }));
      },
      error: (err) => console.error('Error fetching provinces:', err)
    });
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
      .setTipologies(this.filterTipologies)
      
      if (this.filterIdProvince) {
        filter.setIdProvince(this.filterIdProvince);
      }


    console.log('Applying filter:', filter);
    this.houseFilter = HouseFilter.builder();
    this.applyFilterEvent.emit(filter.build());
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
