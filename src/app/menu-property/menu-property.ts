import {Component} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-menu-property',
  imports: [MatSidenavModule, RouterOutlet],
  templateUrl: './menu-property.html',
  styleUrl: './menu-property.scss',
})
export class MenuProperty {

}
