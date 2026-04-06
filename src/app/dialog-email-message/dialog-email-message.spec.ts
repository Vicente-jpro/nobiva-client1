import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEmailMessage } from './dialog-email-message';

describe('DialogEmailMessage', () => {
  let component: DialogEmailMessage;
  let fixture: ComponentFixture<DialogEmailMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEmailMessage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEmailMessage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
