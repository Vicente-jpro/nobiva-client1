import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseOwner } from './house-owner';

describe('HouseOwner', () => {
  let component: HouseOwner;
  let fixture: ComponentFixture<HouseOwner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseOwner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseOwner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
