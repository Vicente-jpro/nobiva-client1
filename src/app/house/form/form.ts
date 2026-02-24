import { ChangeDetectionStrategy, Component, inject, Input, computed, signal, Output, EventEmitter } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
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



export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
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
    RouterLink
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

    readonly task = signal<Task>({
    name: 'Roles task',
    completed: false,
    subtasks: [
      {name: 'Administrador', completed: false},
      {name: 'Proprietário', completed: false},
      {name: 'Inclino', completed: false},
    ],
  });


  house = new HouseCreateRequest();

  signUpForm = new HouseFormBuilder()

  onSubmit(){

    console.log(this.signUpForm.build(this.house).value);
  }

}
