import { Component, inject, OnInit } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { HouseService } from '../service/house-service';
import { HousePartial } from './house-partial/house-partial';


@Component({
  selector: 'app-house',
  imports: [MatTabsModule, HousePartial],
  templateUrl: './house.html',
  styleUrl: './house.scss',
})
export class House implements OnInit {

  private service = inject(HouseService);
  constructor() { }

  ngOnInit(): void {
    this.service.findAll().subscribe({
      next: (response) => {
        console.log('Houses retrieved successfully:', response); 
      },
      error: (err) => {
        
      }  
    });
  }

}
