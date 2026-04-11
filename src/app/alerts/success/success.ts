import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-success',
  imports: [],
  templateUrl: './success.html',
  styleUrl: './success.scss',
})
export class Success {
   @Input() successMessageData = '';
}
