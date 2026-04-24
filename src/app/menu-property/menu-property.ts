import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from "@angular/router";
import { HouseTree } from "../house/house-tree/house-tree";
import { Filter } from "../house/filter/filter";
import { AuthService } from '../service/auth.service';
import { HouseService } from '../service/house-service';
import { HouseFilter } from '../models/house/house-filter';


@Component({
  selector: 'app-menu-property',
  imports: [
    FormsModule,
    RouterOutlet,
    HouseTree,
    Filter
],
  templateUrl: './menu-property.html',
  styleUrl: './menu-property.scss',
})
export class MenuProperty {
  isChecked = true;
  private houseService = inject(HouseService);


  taggleChecked() {
    this.isChecked = !this.isChecked;
  }

  applyFilter(filter: HouseFilter): void {
    this.houseService.emitFilter(filter);
  }
}
