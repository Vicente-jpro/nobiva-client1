import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { HouseService } from '../service/house-service';
import { HousePartial } from './house-partial/house-partial';
import { HouseOwner } from './house-owner/house-owner';
import { HouseResponse } from '../models/house/house-response';
import { RoomResponse } from '../models/room/room-response';
import { TypeNegotiation } from '../models/negotiation-type';
import { AuthService } from '../service/auth.service';
import { HouseFilter } from '../models/house/house-filter';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-house',
  imports: [HousePartial, HouseOwner],
  templateUrl: './house.html',
  styleUrl: './house.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class House implements OnInit, OnDestroy {
  
  private changeDetection = inject(ChangeDetectorRef);
  protected houses = signal<HouseResponse[]>([]);
  user = inject(AuthService); 

  private service = inject(HouseService);
  chengeDetection = inject(ChangeDetectorRef);
  page = 0;

  negotiationType = TypeNegotiation.ARRENDAMENTO;
  negotiation = TypeNegotiation;

  houseFilter: HouseFilter = new HouseFilter();

  activeTab = 'casas';

  private filterSub?: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.houseFilter.negotiation = this.negotiationType;
    this.findByFilter(this.houseFilter, this.page);

    this.filterSub = this.service.filterChanged$.subscribe(filter => {
      this.applyFilter(filter);
    });
  }

  ngOnDestroy(): void {
    this.filterSub?.unsubscribe();
  }

  applyFilter(filter: HouseFilter): void {
    this.houses.set([]);
    this.houseFilter = filter;
    this.page = 0;
    this.findByFilter(this.houseFilter, this.page);
  }
  

  goToNextPage() {
    this.page++;
    this.findByFilter(this.houseFilter, this.page);
  }
  onShowDetails(event: { houseData: HouseResponse, roomData: RoomResponse }) {
    console.log('Show details event received:', event);
  }

  findByFilter(houseFilter: HouseFilter, pageNumber: number) {
    this.service.findByFilter(houseFilter, pageNumber).subscribe({
      next: (response) => {
        this.houses.update(current => [...current, ...response]);
        this.chengeDetection.markForCheck();
        console.log('House filter: ', houseFilter);
        console.log('Houses retrieved successfully:', response);
      },
      error: (err) => {
        console.error('Error retrieving houses:', err);
      }
    });
  }

  getHouseOwner() {
    this.page = 0;
    this.houses.set([]);
    this.findAllByOwner(this.page);
  }

    private findAllByOwner(pageNumber: number): void {
    if (this.user.isLoggedIn()) {
      this.service.findAllByOwner(pageNumber).subscribe({
        next: (response) => {

          this.houses.update(current => [...current, ...response]);
          this.changeDetection.markForCheck();
          console.log('Owner houses retrieved successfully:', response);
        },
        error: (err) => {
          console.error('Error retrieving owner houses:', err);
        }
      });
    }
  }

}

