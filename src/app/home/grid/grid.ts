import { Component } from '@angular/core';
import { Card, HomeItem } from '../card/card';

@Component({
  selector: 'app-grid',
  imports: [Card],
  templateUrl: './grid.html',
  styleUrl: './grid.scss',
})
export class Grid {

    items: HomeItem[] = [
    {
      description: 'Queres saber quanto custa a sua casa? Entrar em contacto com um mobiliario.',
      imageUrl: 'https://www.visateam.pt/wp-content/uploads/2018/07/Luanda_1500x800.jpg'
    },
    {
      description: 'Queres saber quanto custa a tua casa? Entrar em contacto com um mobiliario.', 
      imageUrl: 'https://material.angular.dev/assets/img/examples/shiba1.jpg'
    },
        {
      description: 'Queres saber quanto custa a tua casa? Entrar em contacto com um mobiliario.', 
      imageUrl: 'https://www.visateam.pt/wp-content/uploads/2018/07/Luanda_1500x800.jpg'
    }

  ]
}
