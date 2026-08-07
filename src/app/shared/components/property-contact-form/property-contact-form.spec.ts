import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';

import { AuthService } from '../../../service/auth.service';
import { EmailContactTaskService } from '../../../service/email-contact-task';
import { PropertyContactForm } from './property-contact-form';

describe('PropertyContactForm', () => {
  let fixture: ComponentFixture<PropertyContactForm>;
  let component: PropertyContactForm;
  let loggedIn: boolean;
  const service = { send: vi.fn(() => of({ message: 'Mensagem enviada.' })) };

  beforeEach(async () => {
    loggedIn = true;
    service.send.mockClear();
    await TestBed.configureTestingModule({
      imports: [PropertyContactForm],
      providers: [
        { provide: EmailContactTaskService, useValue: service },
        {
          provide: AuthService,
          useValue: {
            isLoggedIn: () => loggedIn,
            getEmail: () => 'cliente@nobiva.test',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyContactForm);
    component = fixture.componentInstance;
    component.ownerEmail = 'proprietario@nobiva.test';
    component.houseId = 'house-1';
    fixture.detectChanges();
  });

  it('prefills the authenticated email and polite default message', () => {
    expect(component.contactForm.getRawValue()).toEqual({
      clientEmail: 'cliente@nobiva.test',
      message: PropertyContactForm.DEFAULT_MESSAGE,
    });
    expect(fixture.nativeElement.querySelector('input').readOnly).toBe(true);
  });

  it('preserves the existing API payload contract', () => {
    component.contactForm.controls.message.setValue('Gostaria de visitar o imóvel.');
    component.onSubmit();

    expect(service.send).toHaveBeenCalledWith(expect.objectContaining({
      ownerEmail: 'proprietario@nobiva.test',
      clientEmail: 'cliente@nobiva.test',
      message: 'Gostaria de visitar o imóvel.',
      houseId: 'house-1',
      roomId: '',
    }));
  });

  it('does not send when unauthenticated or invalid', () => {
    loggedIn = false;
    component.onSubmit();
    fixture.detectChanges();
    expect(service.send).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Inicie sessão para contactar o proprietário.');

    loggedIn = true;
    component.contactForm.controls.message.setValue('');
    component.onSubmit();
    expect(service.send).not.toHaveBeenCalled();
  });

  it('keeps the form actionable for visitors so authentication feedback can be shown', () => {
    loggedIn = false;
    fixture = TestBed.createComponent(PropertyContactForm);
    component = fixture.componentInstance;
    component.ownerEmail = 'proprietario@nobiva.test';
    fixture.detectChanges();

    const email: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const submit: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(email.readOnly).toBe(false);
    expect(submit.disabled).toBe(false);

    submit.click();
    fixture.detectChanges();
    expect(service.send).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Inicie sessão para contactar o proprietário.');
  });

  it('prevents duplicate submissions while saving', () => {
    const pending = new Subject<{ message: string }>();
    service.send.mockReturnValueOnce(pending.asObservable());

    component.onSubmit();
    component.onSubmit();

    expect(service.send).toHaveBeenCalledTimes(1);
    pending.next({ message: 'Mensagem enviada.' });
    pending.complete();
  });

  it('uses OnPush change detection', () => {
    expect((PropertyContactForm as any).ɵcmp.onPush).toBe(true);
  });
});
