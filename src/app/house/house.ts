import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { HouseService } from '../service/house-service';
import { HousePartial } from './house-partial/house-partial';
import { HouseResponse } from '../models/house/house-response';
import { RoomResponse } from '../models/room/room-response';
import { TypeNegotiation } from '../models/negotiation-type';


@Component({
  selector: 'app-house',
  imports: [HousePartial],
  templateUrl: './house.html',
  styleUrl: './house.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class House implements OnInit {

  protected houses = signal<HouseResponse[]>([]);

  private service = inject(HouseService);
  chengeDetection = inject(ChangeDetectorRef);
  page = 0;

  negotiationType = TypeNegotiation.ARRENDAMENTO;
  negotiation = TypeNegotiation;

  myhouses = signal<HouseResponse[]>([]);
  myPage = 0;

  activeTab = 'casas';

  constructor() { }

  ngOnInit(): void {
    this.findByTypeNegotiation(this.negotiationType, this.page);
    this.findAllByOwner(this.myPage);
  }

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  onShowDetails(event: { houseData: HouseResponse, roomData: RoomResponse }) {
    console.log('Show details event received:', event);
  }

  findByTypeNegotiation(typeNegotiation: TypeNegotiation, pageNumber: number) {
    this.service.findByTypeNegotiation(typeNegotiation, pageNumber).subscribe({
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
    this.findByTypeNegotiation(this.negotiationType, this.page);
  }

  goToNextMyPage() {
    this.myPage++;
    this.findAllByOwner(this.myPage);
  }

  changeTypeNegotiation(type: TypeNegotiation) {
    this.negotiationType = type;
    this.page = 0;
    this.findByTypeNegotiation(this.negotiationType, this.page);
  }

  findAllByOwner(pageNumber: number) {
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
