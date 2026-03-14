import { ChangeDetectionStrategy, Component, inject, Input, computed, signal, Output, EventEmitter } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldControl, MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../user/service/auth.service';
import { UserRole } from '../../models/user/userRole';
import { UserSignup } from '../../models/user/userSignup';
import { HouseCreateRequest } from '../../models/house/house-create-request';
import { HouseFormBuilder } from './house-form-builder';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';


export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-form',
    imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatListModule,
    RouterLink,
    MatRadioModule,
    MatSelectModule,
],
  templateUrl: './form.html',
  styleUrl: './form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Form extends HouseFormBuilder {

    protected authService = inject(AuthService);
    protected role = UserRole;

    @Input() title: string = '';

    @Output() formEvent = new EventEmitter<UserSignup>();


  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];

    readonly task = signal<Task>({
    name: 'Roles task',
    completed: false,
    subtasks: [
      {name: 'Administrador', completed: false},
      {name: 'Proprietário', completed: false},
      {name: 'Inclino', completed: false},
    ],
  });

  onSubmit(){

    console.log(this.houseForm.value);
  }

}
