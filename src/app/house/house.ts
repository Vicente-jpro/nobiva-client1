import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { HouseService } from '../service/house-service';
import { HousePartial } from './house-partial/house-partial';
import { HouseResponse } from '../models/house/house-response';


@Component({
  selector: 'app-house',
  imports: [MatTabsModule, HousePartial],
  templateUrl: './house.html',
  styleUrl: './house.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class House implements OnInit {

  protected houses = signal<HouseResponse[]>([]);

  private service = inject(HouseService);
  constructor() { }

  ngOnInit(): void {
    this.service.findAll().subscribe({
      next: (response) => {
        this.houses.set(response);
        console.log('Houses retrieved successfully:', response); 
      },
      error: (err) => {
        console.error('Error retrieving houses:', err);
      }  
    });
  }

  onDelete(idHouse: string) {
    this.service.delete(idHouse).subscribe({
      next: () => {
        this.houses.update(list => list.filter(house => house.idHouse !== idHouse));
      },
      error: (err) => {
        console.error('Error deleting house:', err);
      }
    });
  }

}
