import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from '../../../service/auth.service';
import { Form } from './form';

describe('Signup Form', () => {
  let fixture: ComponentFixture<Form>;
  let component: Form;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Form],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: { hasAnyRole: () => false },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Form);
    component = fixture.componentInstance;
    component.mode = 'create';
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('requires a valid Angolan telephone', () => {
    const telephone = component.signUpForm.controls.telephone;

    telephone.setValue('');
    expect(telephone.hasError('required')).toBe(true);

    telephone.setValue('abc');
    expect(telephone.hasError('pattern')).toBe(true);

    telephone.setValue('+244 923 456 789');
    expect(telephone.valid).toBe(true);
  });

  it('includes telephone in the registration payload', () => {
    const emitted: unknown[] = [];
    component.formEvent.subscribe(value => emitted.push(value));
    component.signUpForm.patchValue({
      username: 'Maria',
      email: 'maria@nobiva.test',
      telephone: '+244 923 456 789',
      password: 'Password123',
      passwordConfirmed: 'Password123',
    });

    component.onSubmit();

    expect(emitted).toHaveLength(1);
    expect(emitted[0]).toEqual(expect.objectContaining({
      telephone: '+244 923 456 789',
    }));
  });
});
