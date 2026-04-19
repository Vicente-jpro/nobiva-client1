import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-danger',
  imports: [MatButtonModule, MatDividerModule, MatIconModule],
  templateUrl: './danger.html',
  styleUrl: './danger.scss',
})
export class Danger {

  @Input() dangerMessagesData: string[] = [];

}
