import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HouseResponse } from '../models/house/house-response';
import { RoomResponse } from '../models/room/room-response';
import { PropertyContactForm } from '../shared/components/property-contact-form/property-contact-form';


@Component({
  selector: 'app-dialog-email-message',
  imports: [PropertyContactForm],
  templateUrl: './dialog-email-message.html',
  styleUrl: './dialog-email-message.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogEmailMessage {

  @Input() houseData = new HouseResponse();
  @Input() roomData = new RoomResponse();

  protected modalVisible = false;

  openModal(): void {
    this.modalVisible = true;
  }

  closeModal(): void {
    this.modalVisible = false;
  }
}
