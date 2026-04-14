import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HouseResponse } from '../../models/house/house-response';
import { DialogEmailMessage } from '../../dialog-email-message/dialog-email-message';
import { Favorite } from '../favorite/favorite';
import { Success } from '../../alerts/success/success';
import { Danger } from '../../alerts/danger/danger';
import { DisplayMessage } from '../../models/display-message';
import { RoomResponse } from '../../models/room/room-response';

@Component({
  selector: 'app-house-partial',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    DialogEmailMessage,
    Favorite,
    Success,
    Danger
  ],
  templateUrl: './house-partial.html',
  styleUrl: './house-partial.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HousePartial {

  @Input() houseData: HouseResponse = new HouseResponse();
  @Input() roomData: any = null;
  display = new DisplayMessage();
  changeDetection = inject(ChangeDetectorRef);

  @Output() deleteEvent = new EventEmitter<string>();
  @Output() showDetailsEvent = new EventEmitter<{ houseData: HouseResponse, roomData: RoomResponse }>();

  onDelete(idHouse: string) {
    console.log('Delete event emitted for house ID:', idHouse);
    this.deleteEvent.emit(idHouse);
  }

  saveFavorite(display: DisplayMessage): void {
    console.log('Received display message from Favorite component:', display);
    // Aqui você pode lidar com a mensagem de sucesso ou erro, por exemplo, exibindo um alerta ou atualizando a interface do usuário.
    this.display = display;
    this.changeDetection.markForCheck();
  }

  showDetails(houseData: HouseResponse, roomData: RoomResponse): void {
    console.log('House Data:', houseData);
    console.log('Room Data:', roomData);
    this.showDetailsEvent.emit({ houseData, roomData });
  }
}