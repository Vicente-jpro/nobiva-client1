import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { HouseService } from '../service/house-service';
import { HousePartial } from './house-partial/house-partial';
import { HouseResponse } from '../models/house/house-response';
import { RoomResponse } from '../models/room/room-response';
import { TypeNegotiation } from '../models/negotiation-type';
import { AuthService } from '../service/auth.service';
import { Filter } from "./filter/filter";
import { HouseFilter } from '../models/house/house-filter';


@Component({
  selector: 'app-house',
  imports: [HousePartial, Filter],
  templateUrl: './house.html',
  styleUrl: './house.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class House implements OnInit {

  protected houses = signal<HouseResponse[]>([]);
  user = inject(AuthService); 

  private service = inject(HouseService);
  chengeDetection = inject(ChangeDetectorRef);
  page = 0;

  negotiationType = TypeNegotiation.ARRENDAMENTO;
  negotiation = TypeNegotiation;

  myhouses = signal<HouseResponse[]>([]);
  myPage = 0;
  houseFilter: HouseFilter = new HouseFilter();

  activeTab = 'casas';

  constructor() { }

  ngOnInit(): void {
    this.houseFilter.negotiation = this.negotiationType;
    
    this.findByFilter(this.houseFilter, this.page);
  }

  applyFilter(){

  }
  
  setTab(tab: string): void {
    this.activeTab = tab;
  }

  onShowDetails(event: { houseData: HouseResponse, roomData: RoomResponse }) {
    console.log('Show details event received:', event);
  }

  findByFilter(houseFilter: HouseFilter, pageNumber: number) {
    this.service.findByFilter(houseFilter, pageNumber).subscribe({
      next: (response) => {
        this.houses.set(response);
        this.chengeDetection.markForCheck();
        console.log('Houses retrieved successfully:', response);
      },
      error: (err) => {
        console.error('Error retrieving houses:', err);
      }
    });
  }

  goToNextPage() {
    this.page++;
    this.findByFilter(this.houseFilter, this.page);
  }

  goToNextMyPage() {
    this.myPage++;
    this.findAllByOwner(this.myPage);
  }

  changeTypeNegotiation(type: TypeNegotiation) {
    this.negotiationType = type;
    this.houseFilter.negotiation = type;
    this.page = 0;
    this.findByFilter(this.houseFilter, this.page);
  }

  findAllByOwner(pageNumber: number) {
    if (this.user.isLoggedIn()) {
      this.service.findAllByOwner(pageNumber).subscribe({
        next: (response) => {
          this.myhouses.set(response);
          this.chengeDetection.markForCheck();
          console.log('Houses retrieved successfully:', response);
        },
        error: (err) => {
          console.error('Error retrieving houses:', err);
        }
      });
    }

  }

}
