import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousePartial } from './house-partial';

describe('HousePartial', () => {
  let component: HousePartial;
  let fixture: ComponentFixture<HousePartial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HousePartial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HousePartial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
