import { Component } from '@angular/core';
import { ImagePanel } from "./image-panel/image-panel";
import { Grid } from "./grid/grid";

@Component({
  selector: 'app-home',
  imports: [ImagePanel, Grid],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
