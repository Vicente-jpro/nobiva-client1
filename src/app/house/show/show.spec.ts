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
    username: 'Maria Manuel',
    telephone: '+244 923 000 000',
    email: 'maria@nobiva.test',
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

  it('aligns the contact card with the title and renders compact owner rows', () => {
    const layout = fixture.nativeElement.querySelector('.house-details-layout');
    const title = layout?.querySelector('h1');
    const contact = layout?.querySelector('aside .owner-contact-card');
    const rows = layout?.querySelectorAll('.owner-details__row');

    expect(title).toBeTruthy();
    expect(contact).toBeTruthy();
    expect(rows?.length).toBe(2);
    expect(rows?.[0].textContent).toContain('Proprietário:');
    expect(rows?.[0].textContent).toContain('Maria Manuel');
    expect(rows?.[1].textContent).toContain('Telemóvel:');
    expect(rows?.[1].textContent).toContain('+244 923 000 000');
  });

  it('formats the international number and opens it in WhatsApp', () => {
    const telephoneLink = fixture.nativeElement.querySelector<HTMLAnchorElement>('.owner-telephone-link');

    expect(telephoneLink.textContent).toContain('+244 923 000 000');
    expect(telephoneLink.getAttribute('href')).toBe('https://wa.me/244923000000');
    expect(telephoneLink.getAttribute('target')).toBe('_blank');
    expect(telephoneLink.getAttribute('rel')).toContain('noopener');
  });

  it('copies the normalized international number', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    await (fixture.componentInstance as any).copyOwnerTelephone();

    expect(writeText).toHaveBeenCalledWith('+244923000000');
    expect((fixture.componentInstance as any).telephoneCopied).toBe(true);
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

  it('falls back to the nested user while APIs transition to the new fields', () => {
    fixture.componentInstance.house = Object.assign(new HouseResponseDetails(), {
      id: 'house-2',
      title: 'Outra casa',
      user: {
        id: 'user-2',
        username: 'Ana Domingos',
        email: 'ana@nobiva.test',
      },
    });
    fixture.componentInstance.changeDetection.markForCheck();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Ana Domingos');
    const contactForm = fixture.nativeElement.querySelector('app-property-contact-form');
    expect(contactForm).toBeTruthy();
  });
});
