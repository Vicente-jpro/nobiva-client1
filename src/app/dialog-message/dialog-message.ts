import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-message',
  templateUrl: 'dialog-message.html',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogMessage {
  readonly data = inject(MAT_DIALOG_DATA, { optional: true });

  @Input() dialogTitle: string = this.data?.title || '';
  @Input() dialogContent: string = this.data?.content || '';
}
