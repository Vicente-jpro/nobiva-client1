import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

import { Edit } from './edit';
import { UserService } from '../../../service/user-service';
import { AuthService } from '../../../service/auth.service';
import { Form } from '../form/form';

describe('Edit', () => {
  let component: Edit;
  let fixture: ComponentFixture<Edit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Edit],
      providers: [
        provideRouter([]),
        {
          provide: UserService,
          useValue: {
            getCurrentUser: () => of({
              id: 'user-id',
              username: 'Maria',
              email: 'maria@nobiva.test',
            }),
            updateCurrentUser: () => of({
              token: 'token',
              type: 'Bearer',
              username: 'Maria',
              email: 'maria@nobiva.test',
              roles: ['PROPRIETARIO'],
            }),
          },
        },
        {
          provide: AuthService,
          useValue: { saveAuthData: () => undefined },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Edit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reuse the signup form and load current profile data', () => {
    fixture.detectChanges();
    const form = fixture.debugElement.query(By.directive(Form)).componentInstance as Form;

    expect(form.signUpForm.controls.username.value).toBe('Maria');
    expect(form.signUpForm.controls.email.value).toBe('maria@nobiva.test');
  });
});
