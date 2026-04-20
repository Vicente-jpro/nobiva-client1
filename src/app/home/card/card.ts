import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface HomeItem {
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  @Input() itemData: HomeItem = {
    description: '',
    imageUrl: ''
  };
}
