import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';


export interface HomeItem {
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-card',
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {

  @Input() itemData : HomeItem = {
    description: '',
    imageUrl: ''
  }

}


