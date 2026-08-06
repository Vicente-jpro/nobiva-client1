import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { HouseResponse } from '../../models/house/house-response';
import { HouseService } from '../../service/house-service';
import { MyPublications } from './my-publications';

function house(id: string, title: string): HouseResponse {
  return Object.assign(new HouseResponse(), {
    idHouse: id,
    title,
    email: 'owner@example.com',
    statusPost: 'PENDENTE',
    subscriptionStatus: 'ATIVO',
  });
}

describe('MyPublications', () => {
  let fixture: ComponentFixture<MyPublications>;
  let pages: Record<number, HouseResponse[]>;
  let service: {
    findAllByOwner: ReturnType<typeof vi.fn>;
    deleteOwned: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    pages = { 0: [house('1', 'Primeira publicação')], 1: [] };
    service = {
      findAllByOwner: vi.fn((page: number) => of(pages[page] ?? [])),
      deleteOwned: vi.fn(() => of(void 0)),
    };

    await TestBed.configureTestingModule({
      imports: [MyPublications],
      providers: [
        provideRouter([]),
        { provide: HouseService, useValue: service },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyPublications);
    fixture.detectChanges();
  });

  afterEach(() => vi.restoreAllMocks());

  it('loads only the current page and shows owner actions', () => {
    const content = fixture.nativeElement.textContent;
    expect(service.findAllByOwner).toHaveBeenCalledWith(0);
    expect(service.findAllByOwner).toHaveBeenCalledWith(1);
    expect(content).toContain('Primeira publicação');
    expect(content).toContain('Ver detalhes');
    expect(content).toContain('Eliminar');
    expect(content).not.toContain('Aprovar');
    expect(content).not.toContain('Reprovar');
  });

  it('replaces rows when moving to the next page', () => {
    pages[1] = [house('2', 'Segunda publicação')];
    pages[2] = [];
    fixture = TestBed.createComponent(MyPublications);
    fixture.detectChanges();

    const nextButton = Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button'))
      .find(button => button.textContent?.includes('Próxima'))!;
    nextButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Segunda publicação');
    expect(fixture.nativeElement.textContent).not.toContain('Primeira publicação');
    expect(fixture.nativeElement.textContent).toContain('Página 2');
  });

  it('deletes through the owner endpoint and reloads the current page', () => {
    const deleteButton = Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button'))
      .find(button => button.textContent?.includes('Eliminar'))!;

    deleteButton.click();
    fixture.detectChanges();

    expect(service.deleteOwned).toHaveBeenCalledWith('1');
    expect(fixture.nativeElement.textContent).toContain('Publicação eliminada com sucesso.');
  });

  it('returns to the previous page after deleting its last publication', () => {
    pages[1] = [house('2', 'Última publicação')];
    pages[2] = [];
    fixture = TestBed.createComponent(MyPublications);
    fixture.detectChanges();

    const nextButton = Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button'))
      .find(button => button.textContent?.includes('Próxima'))!;
    nextButton.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Página 2');

    pages[1] = [];
    const deleteButton = Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button'))
      .find(button => button.textContent?.includes('Eliminar'))!;
    deleteButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Página 1');
    expect(fixture.nativeElement.textContent).toContain('Primeira publicação');
  });

  it('disables previous and next on a single page', () => {
    const buttons = Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button'));
    expect(buttons.find(button => button.textContent?.includes('Anterior'))?.disabled).toBe(true);
    expect(buttons.find(button => button.textContent?.includes('Próxima'))?.disabled).toBe(true);
  });
});
