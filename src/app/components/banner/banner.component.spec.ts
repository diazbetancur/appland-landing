import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HOME_CONTENT } from '../../feature/pages/home/home-content.config';
import { BannerComponent } from './banner.component';

describe('BannerComponent', () => {
  let fixture: ComponentFixture<BannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, BannerComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(BannerComponent);
    fixture.componentRef.setInput('content', HOME_CONTENT.hero);
    fixture.detectChanges();
  });

  it('renders the approved proposition as the only h1', () => {
    const headings = fixture.debugElement.queryAll(By.css('h1'));
    expect(headings.length).toBe(1);
    expect(headings[0].nativeElement.textContent.trim()).toBe(
      HOME_CONTENT.hero.titleLead + HOME_CONTENT.hero.titleHighlight,
    );
    expect(fixture.nativeElement.textContent).toContain(HOME_CONTENT.hero.subtitle);
  });

  it('routes meeting to contacto and services to servicios', () => {
    expect(fixture.debugElement.query(By.css('a[href*="#contacto"]'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('a[href*="#servicios"]'))).not.toBeNull();
  });

  // El resaltado dejo de deducirse buscando una palabra literal dentro del titulo: esa
  // busqueda devolvia cadena vacia en silencio cada vez que la copia dejaba de contenerla.
  // Ahora el fragmento en cian es un campo propio del contenido, y aqui se asegura que
  // nunca quede vacio y que el h1 siga leyendose como una sola frase.
  it('paints the approved trailing fragment of the title and never leaves it empty', () => {
    const h1 = fixture.debugElement.query(By.css('h1'));
    const highlight = fixture.debugElement.query(By.css('.hero__highlight'));
    expect(highlight.nativeElement.textContent.trim()).toBe('con tecnología inteligente.');
    expect(HOME_CONTENT.hero.titleHighlight.length).toBeGreaterThan(0);
    expect(h1.nativeElement.textContent.trim()).toBe(HOME_CONTENT.hero.titleLead + HOME_CONTENT.hero.titleHighlight);
  });

  it('keeps every hero visual decorative and out of the accessibility tree', () => {
    const decorativeImages = fixture.debugElement.queryAll(By.css('.hero img'));
    expect(decorativeImages.length).toBeGreaterThan(0);
    decorativeImages.forEach((image) => {
      expect(image.attributes['alt']).toBe('');
      expect(image.attributes['aria-hidden']).toBe('true');
    });
    fixture.debugElement.queryAll(By.css('.hero__ghost')).forEach((ghost) => {
      expect(ghost.attributes['aria-hidden']).toBe('true');
    });
  });

  it('exposes exactly two hero conversion actions', () => {
    expect(fixture.debugElement.queryAll(By.css('.hero__actions a')).length).toBe(2);
    expect(fixture.debugElement.query(By.css('.hero__actions a[href*="wa.me"]'))).toBeNull();
  });

  it('does not render the capabilities list of icons/labels below the actions', () => {
    expect(fixture.debugElement.query(By.css('.hero__capabilities'))).toBeNull();
  });

  it('states the approved business-focus claim on the accent card', () => {
    const accentCard = fixture.debugElement.query(By.css('.hero__card--accent'));

    expect(accentCard).not.toBeNull();

    // Los dos parrafos se apilan como bloques, asi que se asserean por separado en vez de
    // concatenar su texto: entre ellos no hay nodo de texto que los separe.
    const lines = accentCard.queryAll(By.css('p')).map((paragraph) => paragraph.nativeElement.textContent.trim());

    expect(lines).toEqual(['100%', 'enfocadas en tu negocio']);
  });
});
