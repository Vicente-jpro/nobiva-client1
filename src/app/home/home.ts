import { Component } from '@angular/core';
import { ImagePanel } from "./image-panel/image-panel";

@Component({
  selector: 'app-home',
  imports: [ImagePanel],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
