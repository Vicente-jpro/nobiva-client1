import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HouseService } from '../service/house-service';
import { HousePartial } from './house-partial/house-partial';
import { HouseResponse } from '../models/house/house-response';
import { RoomResponse } from '../models/room/room-response';
import { TypeNegotiation } from '../models/negotiation-type';
import {MatButtonToggleModule} from '@angular/material/button-toggle';


@Component({
  selector: 'app-house',
  imports: [MatTabsModule, MatButtonModule, MatIconModule, HousePartial, MatButtonToggleModule],
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

  constructor() { }

  ngOnInit(): void {
    this.findByTypeNegotiation(this.negotiationType, this.page);
    this.findAllByOwner(this.myPage);
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
    console.log('Going to page:', this.page);
    this.findByTypeNegotiation(this.negotiationType, this.page);
  }

  goToNextMyPage() {
    this.myPage++;
    console.log('Going to my page:', this.myPage);
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

