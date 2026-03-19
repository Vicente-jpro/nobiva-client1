import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { HouseResponse } from '../../models/house/house-response';


@Component({
  selector: 'app-house-partial',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './house-partial.html',
  styleUrl: './house-partial.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HousePartial {

  @Input() houseData: HouseResponse = new HouseResponse();

  @Output() deleteEvent = new EventEmitter<string>();

  onDelete(idHouse: string) {
    console.log('Delete event emitted for house ID:', idHouse);
    this.deleteEvent.emit(idHouse);
  }

}
