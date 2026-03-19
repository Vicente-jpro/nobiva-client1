import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { HouseResponse } from '../../models/house/house-response';

@Component({
  selector: 'app-house-partial',
  imports: [NgOptimizedImage, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './house-partial.html',
  styleUrl: './house-partial.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HousePartial {

  @Input() houseData: HouseResponse = new HouseResponse();

}
