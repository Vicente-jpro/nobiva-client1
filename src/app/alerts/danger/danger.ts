import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-danger',
  imports: [],
  templateUrl: './danger.html',
  styleUrl: './danger.scss',
})
export class Danger {
  @Input() dangerMessagesData: string[] = [];
}
