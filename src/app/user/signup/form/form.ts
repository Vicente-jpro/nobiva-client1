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
import { UserSignup } from '../../model/userSignup';


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
export class Form {
    private formBuilder = inject(FormBuilder);

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


    user: UserSignup = {
    email: '',
    username: '',
    password: '',
    passwordConfirmed: '',
    roles: []
  }

  signUpForm = this.formBuilder.group({
      username: [this.user.username, [Validators.required, Validators.minLength(3)]],
      email: [this.user.email, [Validators.required, Validators.email]],
      password: [this.user.password, [Validators.required, Validators.minLength(6)]],
      passwordConfirmed: [this.user.passwordConfirmed, [Validators.required, Validators.minLength(6)]],
      inclino: [false],
      proprietario: [false],
      administrador: [false],
      empresa: [false], 
      superAdministrador: [false]
    });

  onSubmit(){
    
    this.user.roles = [];
    this.user.username = this.signUpForm.value.username || '';
    this.user.email = this.signUpForm.value.email || '';
    this.user.password = this.signUpForm.value.password || '';
    this.user.passwordConfirmed = this.signUpForm.value.passwordConfirmed || '';
    
    if (this.signUpForm.value.administrador) {
      this.user.roles.push('ADMINSTRADOR');
    }
    if (this.signUpForm.value.proprietario) {
      this.user.roles.push('PROPRIETARIO');
    }
    if (this.signUpForm.value.inclino) {
      this.user.roles.push('INCLINO');
    }
    if (this.signUpForm.value.empresa) {
      this.user.roles.push('EMPRESA');
    }
    if (this.signUpForm.value.superAdministrador) {
      this.user.roles.push('SUPER_ADMINSTRADOR');
    }

    this.formEvent.emit(this.user);

    if (this.signUpForm.value.password !== this.signUpForm.value.passwordConfirmed) {
      console.error('As senhas não coincidem!');
      return;
    }
    // { firstName: 'Nancy', lastName: 'Drew' }
  }

}
