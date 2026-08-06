import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanModel } from '../../../models/plan';
import { PlanCard } from './plan-card';

@Component({
  imports: [PlanCard],
  template: `
    <app-plan-card [plan]="plan">
      <button plan-card-actions type="button">Editar</button>
    </app-plan-card>
  `,
})
class PlanCardHost {
  plan: PlanModel = {
    id: 'plan-1',
    type: 'MENSAL',
    description: 'Plano de teste',
    price: 50000,
    maxPosts: 1,
  };
}

describe('PlanCard', () => {
  let fixture: ComponentFixture<PlanCardHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PlanCardHost] }).compileComponents();
    fixture = TestBed.createComponent(PlanCardHost);
    fixture.detectChanges();
  });

  it('should render the plan data and projected actions', () => {
    const content = fixture.nativeElement.textContent;

    expect(content).toContain('MENSAL');
    expect(content).toContain('30 dias');
    expect(content).toContain('Plano de teste');
    expect(content).toContain('50,000.00');
    expect(content).toContain('AOA / plano');
    expect(content).toContain('Editar');
  });

  it('should use the singular form for one advertisement', () => {
    expect(fixture.nativeElement.textContent).toContain('Até 1 anúncio');
    expect(fixture.nativeElement.textContent).not.toContain('Até 1 anúncios');
  });

  it('should use the plural form for multiple advertisements', () => {
    fixture.componentInstance.plan = { ...fixture.componentInstance.plan, maxPosts: 20 };
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Até 20 anúncios');
  });
});
