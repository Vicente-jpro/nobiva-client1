import { Component, inject } from '@angular/core';
import { Form } from '../form/form';


@Component({
  selector: 'app-new',
  imports: [Form],
  templateUrl: './new.html',
  styleUrl: './new.scss',
})
export class New {
  titleData: string = 'Nova Casa';
}
