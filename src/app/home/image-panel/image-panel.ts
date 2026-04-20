import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Country {
  value: string;
  viewValue: string;
}

interface City {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-image-panel',
  imports: [FormsModule],
  templateUrl: './image-panel.html',
  styleUrl: './image-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagePanel {
  selectedCountry = '';
  selectedCity = '';
  locality = '';

  cities: City[] = [
    { value: 'steak-0', viewValue: 'Luanda' },
    { value: 'pizza-1', viewValue: 'Maputo' },
    { value: 'tacos-2', viewValue: 'Cabo' },
  ];

  countries: Country[] = [
    { value: 'angola-0', viewValue: 'Angola' },
    { value: 'mozambique-1', viewValue: 'Moçambique' },
    { value: 'cabo-verde-2', viewValue: 'Cabo Verde' },
  ];
}
