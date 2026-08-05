import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Edit } from './edit';
import { UserService } from '../../../service/user-service';
import { AuthService } from '../../../service/auth.service';

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
});
