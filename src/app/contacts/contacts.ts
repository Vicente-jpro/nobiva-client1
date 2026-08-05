import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ClienteMessage } from './cliente-message/cliente-message';

@Component({
  selector: 'app-contacts',
  imports: [ClienteMessage],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contacts {}
