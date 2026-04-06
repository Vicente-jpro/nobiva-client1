import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { RouterLink, RouterOutlet } from "@angular/router";
import { HouseTree } from "../house/house-tree/house-tree";


@Component({
  selector: 'app-menu-property',
imports: [
    MatSlideToggleModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatListModule,
    RouterOutlet,
    HouseTree
],
  templateUrl: './menu-property.html',
  styleUrl: './menu-property.scss',
})
export class MenuProperty {

  isChecked = true;

  taggleChecked() {
    this.isChecked = !this.isChecked;
  }

 
}
