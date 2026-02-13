import {ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';

import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

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
  imports: [
    MatExpansionModule, 
    FormsModule, 
    MatInputModule, 
    MatSelectModule, 
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
],
  templateUrl: './image-panel.html',
  styleUrl: './image-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagePanel {
 readonly panelOpenState = signal(false);

   cities: City[] = [
    {value: 'steak-0', viewValue: 'Luanda'},
    {value: 'pizza-1', viewValue: 'Maputo'},
    {value: 'tacos-2', viewValue: 'Cabo'},
  ];

   countries: Country[] = [
    {value: 'angola-0', viewValue: 'Angola'},
    {value: 'mozambique-1', viewValue: 'Moçambique'},
    {value: 'cabo-verde-2', viewValue: 'Cabo Verde'},
  ];
}
