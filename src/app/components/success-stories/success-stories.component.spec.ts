import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { selectVisibleCases } from '../../feature/pages/home/home-content.config';
import { HorizontalCarouselDirective } from '../../shared/directives/horizontal-carousel.directive';
import { SuccessStoriesComponent } from './success-stories.component';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { useTranslations } from '../../shared/i18n/translations.testing';

describe('SuccessStoriesComponent', () => {
  let fixture: ComponentFixture<SuccessStoriesComponent>;
  /** Traduce una clave del contenido para comparar contra el texto que se pinta. */
  const t = (key: string): string => TestBed.inject(TranslateService).instant(key);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessStoriesComponent, HorizontalCarouselDirective],
      providers: [provideTranslateService({ fallbackLang: 'es' })],
    }).compileComponents();
    await useTranslations();
    fixture = TestBed.createComponent(SuccessStoriesComponent);
    fixture.componentInstance.cases = selectVisibleCases();
    fixture.detectChanges();
  });

  it('renders only the approved cases in order, each with its approved media and no invented action', () => {
    const visible = selectVisibleCases();
    const cards = fixture.debugElement.queryAll(By.css('.case-card'));
    expect(cards.length).toBe(visible.length);
    expect(cards.map((card) => card.query(By.css('h3')).nativeElement.textContent.trim())).toEqual(
      visible.map((item) => item.name),
    );
    cards.forEach((card, index) => {
      const img = card.query(By.css('img')).nativeElement;
      expect(img.src).toContain(visible[index].media?.src);
      expect(img.alt).toBe(t(visible[index].media!.altKey));
    });
    expect(fixture.debugElement.query(By.css('.case-card a'))).toBeNull();
  });

  it('exposes a labelled, focusable manual carousel without autoplay', () => {
    const track = fixture.debugElement.query(By.css('[aria-roledescription="carrusel"]'));
    expect(track.attributes['aria-labelledby']).toBe('casos-title');
    expect(track.attributes['tabindex']).toBe('0');
    expect(fixture.debugElement.queryAll(By.css('.cases__control')).length).toBe(2);
    expect((fixture.componentInstance as unknown as { interval?: unknown }).interval).toBeUndefined();
  });

  it('runs the carousel in a circular loop, so the controls never dead-end', () => {
    const track = fixture.debugElement.query(By.directive(HorizontalCarouselDirective));

    expect(track.injector.get(HorizontalCarouselDirective).loop).toBe(true);
  });

  it('announces the position to assistive technology without showing any visual indicator', () => {
    // La seccion no muestra ni contador ni puntos: al ser circular no hay extremos que
    // senalar. Pero quien navega con lector de pantalla si necesita saber por donde va.
    const position = fixture.debugElement.query(By.css('.cases__position'));

    expect(fixture.debugElement.query(By.css('.cases__dots'))).toBeNull();
    expect(position).not.toBeNull();
    expect(position.attributes['aria-live']).toBe('polite');
    expect(position.nativeElement.classList).toContain('appland-visually-hidden');
    expect(position.nativeElement.textContent.trim()).toMatch(/^\d+ de \d+$/);
  });

  it('renders the approved section heading with its highlighted word', () => {
    const heading = fixture.debugElement.query(By.css('#casos-title'));
    expect(heading.nativeElement.textContent.trim()).toBe('Algunos proyectos desarrollados');
    expect(heading.query(By.css('.cases__highlight')).nativeElement.textContent.trim()).toBe('proyectos');
  });

  /**
   * El resaltado tiene que distinguirse del resto del titular.
   *
   * Comprobar que el `<span>` existe con su palabra no alcanza, y el spec 009 lo demostro: al
   * pasar el titular a `[innerHTML]`, el nodo deja de recibir el atributo de encapsulacion de
   * Angular, los estilos del componente dejan de aplicarle y el resaltado quedaba en el color
   * del titular. El span seguia ahi, con su texto, y las pruebas en verde.
   *
   * Se compara contra el color del propio titular en vez de contra un valor fijo, para que la
   * prueba siga valiendo si cambia la paleta.
   */
  it('paints the highlighted fragment in its own colour', () => {
    const heading = fixture.debugElement.query(By.css('#casos-title')).nativeElement;
    const highlighted = fixture.debugElement.query(By.css('.cases__highlight')).nativeElement;

    expect(getComputedStyle(highlighted).color).not.toBe(getComputedStyle(heading).color);
  });
});
