import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatChipsModule} from '@angular/material/chips';
import { Footer } from "./footer/footer";
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'app-root',
   imports: [
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatMenuModule, 
    MatChipsModule, 
    RouterOutlet, 
    Footer,
    MatProgressBarModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
   
})
export class App {
  protected readonly title = signal('Nobiva');
}
