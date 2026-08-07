import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { HouseResponseDetails } from '../../models/house/house-response-details';
import { AuthService } from '../../service/auth.service';
import { EmailContactTaskService } from '../../service/email-contact-task';
import { FavoriteHouseService } from '../../service/favorite-house-service';
import { HouseService } from '../../service/house-service';
import { Show } from './show';

describe('Show', () => {
  let fixture: ComponentFixture<Show>;
  let loggedIn: boolean;

  const house = Object.assign(new HouseResponseDetails(), {
    id: 'house-1',
    title: 'Casa de teste',
    ownerName: 'Maria Manuel',
    ownerTelephone: '+244 923 000 000',
    ownerEmail: 'maria@nobiva.test',
  });

  beforeEach(async () => {
    loggedIn = true;
    await TestBed.configureTestingModule({
      imports: [Show],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'house-1' } } },
        },
        { provide: HouseService, useValue: { findById: vi.fn(() => of(house)) } },
        { provide: FavoriteHouseService, useValue: { save: vi.fn() } },
        { provide: EmailContactTaskService, useValue: { send: vi.fn() } },
        {
          provide: AuthService,
          useValue: {
            isLoggedIn: () => loggedIn,
            getEmail: () => 'cliente@nobiva.test',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Show);
    fixture.detectChanges();
  });

  it('renders real owner contact data and the shared form for authenticated users', () => {
    const content = fixture.nativeElement.textContent;

    expect(content).toContain('Maria Manuel');
    expect(content).toContain('+244 923 000 000');
    expect(fixture.nativeElement.querySelector('app-property-contact-form')).toBeTruthy();
  });

  it('keeps favorite, owner contact and form visible to visitors', () => {
    loggedIn = false;
    fixture = TestBed.createComponent(Show);
    fixture.detectChanges();
    const content = fixture.nativeElement.textContent;

    expect(content).toContain('Casa de teste');
    expect(content).toContain('Maria Manuel');
    expect(content).toContain('+244 923 000 000');
    expect(content).toContain('Guardar como favorito');
    expect(fixture.nativeElement.querySelector('app-property-contact-form')).toBeTruthy();
  });

  it('uses OnPush change detection', () => {
    expect((Show as any).ɵcmp.onPush).toBe(true);
  });
});
