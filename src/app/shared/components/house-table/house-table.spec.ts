import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HouseResponse } from '../../../models/house/house-response';
import { HouseTable } from './house-table';

@Component({
  imports: [HouseTable],
  template: `
    <app-house-table [houses]="houses()" [actionsTemplate]="actions" />
    <ng-template #actions let-house>
      <button type="button">Ver {{ house.title }}</button>
    </ng-template>
  `,
})
class HouseTableHost {
  houses = signal<HouseResponse[]>([{
    idHouse: 'house-1', title: 'Casa de teste', email: 'owner@example.com',
    imageUrl: '', subscriptionStatus: 'ATIVO', tipology: 'T2', price: 50000,
    statusPost: 'PENDENTE', createdAt: '2026-08-06T14:22:06', avaliable: true,
    description: '', locality: '', street1: '', country: '', province: '',
    typeNegotiation: '', propertyType: '',
  }]);
}

describe('HouseTable', () => {
  let fixture: ComponentFixture<HouseTableHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HouseTableHost] }).compileComponents();
    fixture = TestBed.createComponent(HouseTableHost);
    fixture.detectChanges();
  });

  it('renders house data, badges and projected row actions', () => {
    const content = fixture.nativeElement.textContent;
    expect(content).toContain('Casa de teste');
    expect(content).toContain('owner@example.com');
    expect(content).toContain('ATIVO');
    expect(content).toContain('PENDENTE');
    expect(content).toContain('Ver Casa de teste');
  });

  it('renders the configured empty message', () => {
    fixture.componentInstance.houses.set([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Nenhum imóvel encontrado.');
  });
});
