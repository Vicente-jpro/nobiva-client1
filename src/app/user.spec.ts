import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from './service/auth.service';
import { UserService } from './service/user-service';
import { User } from './user/user';

describe('User', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [User],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: { logout: () => of({ message: 'OK' }) } },
        { provide: AuthService, useValue: { logout: () => undefined } },
      ],
    }).compileComponents();
  });

  it('should be created', () => {
    const fixture = TestBed.createComponent(User);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
