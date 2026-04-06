import { MatDialog } from "@angular/material/dialog";
import { DialogMessage } from "./dialog-message";
import { inject } from "@angular/core";

export class DialogMessageData {
  readonly dialog = inject(MatDialog);

   title: string = '';
   content: string = '';

  openDialog() {
    this.dialog.open(DialogMessage, {
      data: {
        title: this.title,
        content: this.content
      }
    });
  }
}