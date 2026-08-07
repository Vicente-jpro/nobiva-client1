import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { HouseResponse } from '../../models/house/house-response';
import { RoomResponse } from '../../models/room/room-response';
import { FavoriteHouseService } from '../../service/favorite-house-service';
import { DisplayMessage } from '../../models/display-message';
import { AuthService } from '../../service/auth.service';


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
  private cdr = inject(ChangeDetectorRef);
  protected readonly authService = inject(AuthService);

  onSave(): void {
    if (!this.authService.isLoggedIn()) {
      this.display = {
        success: '',
        errors: ['Inicie sessão para guardar favoritos.'],
      };
      this.onSaveFavoriteEvent.emit(this.display);
      this.cdr.markForCheck();
      return;
    }

    this.service.save(this.houseData.idHouse).subscribe({
      next: (response) => {
        this.display = { success: response.message, errors: [] };
        this.onSaveFavoriteEvent.emit(this.display);
        this.cdr.markForCheck();
      },
      error: (errorResponse) => {
        this.display = { success: '', errors: errorResponse.error.errors };
        this.onSaveFavoriteEvent.emit(this.display);
        this.cdr.markForCheck();
      }
    });
  }
}
