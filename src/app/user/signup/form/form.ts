import { ChangeDetectionStrategy, Component, inject, Input, signal, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { UserSignup } from '../../../models/user/userSignup';
import { UserRole } from '../../../models/user/userRole';
import { AuthService } from '../../../service/auth.service';
import { DisplayMessage } from '../../../models/display-message';
import { Success } from '../../../alerts/success/success';
import { Danger } from '../../../alerts/danger/danger';
import { UserProfile, UserUpdateRequest } from '../../../models/user/user-profile';


export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, FormsModule, RouterLink, Success, Danger],
  templateUrl: './form.html',
  styleUrl: './form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Form implements OnChanges {
  private formBuilder = inject(FormBuilder);
  protected authService = inject(AuthService);
  protected role = UserRole;

  @Input() display: DisplayMessage = new DisplayMessage();

  @Input() title: string = '';
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() initialValue: UserProfile | null = null;
  @Input() loading = false;
  @Input() saving = false;
  @Output() formEvent = new EventEmitter<UserSignup>();
  @Output() updateEvent = new EventEmitter<UserUpdateRequest>();

  readonly task = signal<Task>({
    name: 'Roles task',
    completed: false,
    subtasks: [
      { name: 'Administrador', completed: false },
      { name: 'Proprietário', completed: false },
      { name: 'Inclino', completed: false },
    ],
  });

  user: UserSignup = {
    email: '',
    username: '',
    telephone: '',
    password: '',
    passwordConfirmed: '',
    roles: []
  };

  signUpForm = this.formBuilder.group({
    username: [this.user.username, [Validators.required, Validators.minLength(3), Validators.maxLength(155)]],
    email: [this.user.email, [Validators.required, Validators.email, Validators.maxLength(55)]],
    telephone: [this.user.telephone, [
      Validators.required,
      Validators.maxLength(20),
      Validators.pattern(/^(?:(?:\+?244)[ -]?)?9\d{2}(?:[ -]?\d{3}){2}$/),
    ]],
    password: [this.user.password, [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
    passwordConfirmed: [this.user.passwordConfirmed, [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
    inclino: [false],
    proprietario: [false],
    administrador: [false],
    cliente: [false],
    superAdministrador: [false]
  });

  ngOnChanges(): void {
    if (this.mode === 'edit') {
      this.signUpForm.controls.telephone.clearValidators();
      this.signUpForm.controls.password.setValidators([Validators.maxLength(72)]);
      this.signUpForm.controls.passwordConfirmed.clearValidators();
    } else {
      this.signUpForm.controls.telephone.setValidators([
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern(/^(?:(?:\+?244)[ -]?)?9\d{2}(?:[ -]?\d{3}){2}$/),
      ]);
      this.signUpForm.controls.password.setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(72),
      ]);
      this.signUpForm.controls.passwordConfirmed.setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(72),
      ]);
    }
    this.signUpForm.controls.telephone.updateValueAndValidity({ emitEvent: false });
    this.signUpForm.controls.password.updateValueAndValidity({ emitEvent: false });
    this.signUpForm.controls.passwordConfirmed.updateValueAndValidity({ emitEvent: false });

    if (this.initialValue) {
      this.signUpForm.patchValue({
        username: this.initialValue.username,
        email: this.initialValue.email,
        password: '',
        passwordConfirmed: '',
      });
    }
  }

  onSubmit() {
    this.display = new DisplayMessage();
    this.signUpForm.markAllAsTouched();
    if (this.signUpForm.invalid) return;

    const username = this.signUpForm.controls.username.value?.trim() || '';
    const email = this.signUpForm.controls.email.value?.trim() || '';
    const telephone = this.signUpForm.controls.telephone.value?.trim() || '';
    const password = this.signUpForm.controls.password.value || '';

    if (this.mode === 'edit') {
      const emailChanged = email.toLowerCase()
        !== (this.initialValue?.email || '').trim().toLowerCase();
      if (emailChanged && password.length < 8) {
        this.display = {
          success: '',
          errors: ['Informe a password atual para alterar o email.'],
        };
        return;
      }

      this.updateEvent.emit({
        username,
        email,
        ...(password ? { currentPassword: password } : {}),
      });
      return;
    }

    this.user.roles = [];
    this.user.username = username;
    this.user.email = email;
    this.user.telephone = telephone;
    this.user.password = password;
    this.user.passwordConfirmed = this.signUpForm.value.passwordConfirmed || '';

    if (this.user.password !== this.user.passwordConfirmed) {
      this.display = { success: '', errors: ['Palavra passe de confirmação não pode ser diferente da Palavra passe.'] };
      return;
    }

    if (this.signUpForm.value.administrador) {
      this.user.roles.push(UserRole.adminstrador);
    }
    if (this.signUpForm.value.proprietario) {
      this.user.roles.push(UserRole.proprietario);
    }
    if (this.signUpForm.value.cliente) {
      this.user.roles.push(UserRole.cliente);
    }
    if (this.signUpForm.value.superAdministrador) {
      this.user.roles.push(UserRole.superAdminstrador);
    }

    this.formEvent.emit(this.user);
  }
}
