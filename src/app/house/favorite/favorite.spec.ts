import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AuthService } from '../../service/auth.service';
import { FavoriteHouseService } from '../../service/favorite-house-service';
import { Favorite } from './favorite';

describe('Favorite', () => {
  let fixture: ComponentFixture<Favorite>;
  let loggedIn: boolean;
  const service = { save: vi.fn(() => of({ message: 'Guardado.' })) };

  beforeEach(async () => {
    loggedIn = false;
    service.save.mockClear();
    await TestBed.configureTestingModule({
      imports: [Favorite],
      providers: [
        { provide: FavoriteHouseService, useValue: service },
        { provide: AuthService, useValue: { isLoggedIn: () => loggedIn } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Favorite);
    fixture.componentInstance.houseData.idHouse = 'house-1';
    fixture.detectChanges();
  });

  it('does not call the service without authentication', () => {
    const emitted = vi.fn();
    fixture.componentInstance.onSaveFavoriteEvent.subscribe(emitted);

    expect(fixture.nativeElement.textContent).toContain('Favorito');
    fixture.componentInstance.onSave();

    expect(service.save).not.toHaveBeenCalled();
    expect(emitted).toHaveBeenCalledWith(expect.objectContaining({
      errors: ['Inicie sessão para guardar favoritos.'],
    }));
  });

  it('saves the favorite when authenticated', () => {
    loggedIn = true;
    fixture.componentInstance.onSave();

    expect(service.save).toHaveBeenCalledWith('house-1');
  });
});
