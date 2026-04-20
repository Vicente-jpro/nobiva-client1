import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { HouseResponse } from '../../models/house/house-response';
import { DialogEmailMessage } from '../../dialog-email-message/dialog-email-message';
import { Favorite } from '../favorite/favorite';
import { Success } from '../../alerts/success/success';
import { Danger } from '../../alerts/danger/danger';
import { DisplayMessage } from '../../models/display-message';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-house-partial',
  imports: [
    DecimalPipe,
    DialogEmailMessage,
    Favorite,
    Success,
    Danger,
    RouterLink
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
  router = inject(Router);

  saveFavorite(display: DisplayMessage): void {
    this.display = display;
    this.changeDetection.markForCheck();
  }

  edit(idHouse: string): void {
    this.router.navigate(['casas/', idHouse, 'editar']);
  }
}