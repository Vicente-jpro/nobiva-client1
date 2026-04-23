import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from "@angular/router";
import { HouseTree } from "../house/house-tree/house-tree";
import { Filter } from "../house/filter/filter";


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

  taggleChecked() {
    this.isChecked = !this.isChecked;
  }

  applyFilter(){}
}
