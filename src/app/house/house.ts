import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HouseService } from '../service/house-service';
import { HousePartial } from './house-partial/house-partial';
import { HouseResponse } from '../models/house/house-response';
import { RoomResponse } from '../models/room/room-response';


@Component({
  selector: 'app-house',
  imports: [MatTabsModule, MatButtonModule, MatIconModule, HousePartial],
  templateUrl: './house.html',
  styleUrl: './house.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class House implements OnInit {

  protected houses = signal<HouseResponse[]>([]);

  private service = inject(HouseService);
  chengeDetection = inject(ChangeDetectorRef);
  page = 0;
  constructor() { }

  ngOnInit(): void {
    this.findAllHouses(this.page); 
  }

  onShowDetails(event: { houseData: HouseResponse, roomData: RoomResponse }) {
    console.log('Show details event received:', event);
    
  }

  findAllHouses(pageNumber: number) {
        this.service.findAll(pageNumber).subscribe({
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
    this.findAllHouses(this.page);
  }

}

