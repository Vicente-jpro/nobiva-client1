import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HouseResponse } from '../../models/house/house-response';
import { HousePartial } from './house-partial';

describe('HousePartial', () => {
  let component: HousePartial;
  let fixture: ComponentFixture<HousePartial>;

  const house = Object.assign(new HouseResponse(), {
    idHouse: 'house-123',
    title: 'Moradia familiar',
    description: 'Descrição curta do imóvel.',
    imageUrl: '/house.jpg',
    tipology: 'T3',
    street1: 'Rua Principal',
    locality: 'Talatona',
    province: 'Luanda',
    country: 'Angola',
    price: 500000,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HousePartial],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HousePartial);
    component = fixture.componentInstance;
    component.houseData = house;
    fixture.detectChanges();
  });

  it('renders a short description unchanged with the truncation class', () => {
    const description: HTMLElement = fixture.nativeElement.querySelector('.house-description');

    expect(description).toBeTruthy();
    expect(description.textContent?.trim()).toBe(house.description);
  });

  it('keeps a long description complete in the DOM for CSS-only truncation', () => {
    const longDescription = 'Descrição extensa do imóvel. '.repeat(30).trim();
    component.houseData = Object.assign(new HouseResponse(), house, {
      description: longDescription,
    });
    fixture.detectChanges();

    const description: HTMLElement = fixture.nativeElement.querySelector('.house-description');
    expect(description.textContent?.trim()).toBe(longDescription);
    expect(component.houseData.description).toBe(longDescription);
  });

  it('preserves favorite, contact and details actions', () => {
    const element: HTMLElement = fixture.nativeElement;
    const details = element.querySelector<HTMLAnchorElement>('a.btn-nobiva')!;

    expect(element.querySelector('app-favorite')).toBeTruthy();
    expect(element.querySelector('app-dialog-email-message')).toBeTruthy();
    expect(details.textContent).toContain('Ver Detalhes');
    expect(details.getAttribute('href')).toContain(house.idHouse);
  });

  it('continues using OnPush change detection', () => {
    expect((HousePartial as any).ɵcmp.onPush).toBe(true);
  });
});
