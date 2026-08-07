import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthService } from '../service/auth.service';
import { EmailContactTaskService } from '../service/email-contact-task';
import { DialogEmailMessage } from './dialog-email-message';

describe('DialogEmailMessage', () => {
  let fixture: ComponentFixture<DialogEmailMessage>;
  let loggedIn: boolean;

  beforeEach(async () => {
    loggedIn = false;
    await TestBed.configureTestingModule({
      imports: [DialogEmailMessage],
      providers: [
        {
          provide: AuthService,
          useValue: { isLoggedIn: () => loggedIn, getEmail: () => 'cliente@nobiva.test' },
        },
        { provide: EmailContactTaskService, useValue: { send: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogEmailMessage);
    fixture.detectChanges();
  });

  it('shows and opens the contact form for visitors', () => {
    expect(fixture.nativeElement.textContent).toContain('Contactar');

    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.modal')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-property-contact-form')).toBeTruthy();
  });

  it('shows and opens contact for authenticated users', () => {
    loggedIn = true;
    fixture = TestBed.createComponent(DialogEmailMessage);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Contactar');

    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-property-contact-form')).toBeTruthy();
  });
});
