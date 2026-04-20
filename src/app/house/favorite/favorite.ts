import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { HouseResponse } from '../../models/house/house-response';
import { RoomResponse } from '../../models/room/room-response';
import { FavoriteHouseService } from '../../service/favorite-house-service';
import { DisplayMessage } from '../../models/display-message';


@Component({
  selector: 'app-favorite',
  imports: [],
  templateUrl: './favorite.html',
  styleUrl: './favorite.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Favorite {

  @Input() houseData = new HouseResponse();
  @Input() roomData = new RoomResponse();

  protected service = inject(FavoriteHouseService);
  @Output() onSaveFavoriteEvent = new EventEmitter<DisplayMessage>();
  display = new DisplayMessage();

  onSave(): void {
    this.service.save(this.houseData.idHouse).subscribe({
      next: (response) => {
        this.display.success = response.message;
        this.display.errors = [];
        this.onSaveFavoriteEvent.emit(this.display);
      },
      error: (errorResponse) => {
        this.display.success = '';
        this.display.errors = errorResponse.error.errors;
        this.onSaveFavoriteEvent.emit(this.display);
      }
    });
  }
}
