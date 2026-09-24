import { page } from 'vitest/browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HOME_CONTENT, selectVisibleCases } from '../../feature/pages/home/home-content.config';
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

  /**
   * El viewport por defecto del navegador de pruebas esta por debajo de 1024 px, asi que este
   * caso describe el modo carrusel. El modo cuadricula se comprueba mas abajo fijando el ancho:
   * las dos formas coexisten y ninguna prueba puede dar por supuesto el ancho en el que corre,
   * que es como el recorte llego a produccion con las pruebas en verde.
   */
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

  /**
   * Los proyectos publicados son cuatro y solo entraban tres.
   *
   * La regla de escritorio fijaba `calc((100% - 3rem) / 3)`, tres columnas contadas a mano, asi
   * que la cuarta ficha quedaba fuera: asomaba un 36% a 1024 px y un 17% a 1920, lo justo para
   * leerse como un borde. Quien no usaba la flecha se iba con tres de cuatro. Punto 10 de la
   * auditoria UX/UI.
   *
   * No se comprueba que haya cuatro columnas sino que entren todas las fichas publicadas, sean
   * las que sean: la regla reparte el ancho con `minmax(0, 1fr)` y un quinto proyecto tiene que
   * acomodarse sin tocar nada.
   */
  describe('on desktop', () => {
    /** El viewport del iframe sobrevive a la prueba que lo cambia, asi que se devuelve. */
    const original = { width: window.innerWidth, height: window.innerHeight };
    afterEach(async () => {
      await page.viewport(original.width, original.height);
    });

    /**
     * El componente resuelve el modo al crearse, asi que la ficha se monta despues de fijar el
     * ancho y no antes. Cambiar el viewport sobre una ficha ya montada dejaba la prueba a merced
     * de cuando el navegador despacha el evento de la media query: pasaba aislada y fallaba en la
     * suite completa. El oyente de cambios se comprueba aparte, con la consulta simulada.
     */
    const settle = async (width: number): Promise<void> => {
      await page.viewport(width, 900);
      fixture = TestBed.createComponent(SuccessStoriesComponent);
      fixture.componentInstance.cases = selectVisibleCases();
      fixture.detectChanges();
      await fixture.whenStable();
    };

    for (const width of [1100, 1440, 1920]) {
      it(`shows every published case at once, with nothing left to scroll at ${width}px`, async () => {
        await settle(width);

        const track = fixture.debugElement.query(By.css('.cases__track')).nativeElement as HTMLElement;
        const cards = [...track.querySelectorAll('.case-card')];
        const box = track.getBoundingClientRect();

        expect(cards.length).toBe(selectVisibleCases().length);
        expect(track.scrollWidth - track.clientWidth, 'quedo carrusel escondido').toBeLessThanOrEqual(1);

        for (const card of cards) {
          const rect = card.getBoundingClientRect();
          const visible = Math.min(rect.right, box.right) - Math.max(rect.left, box.left);
          const name = card.querySelector('h3')!.textContent!.trim();
          expect(Math.round(visible), `${name} se ve cortada`).toBeGreaterThanOrEqual(Math.round(rect.width) - 1);
        }
      });
    }

    /** Sin nada que desplazar, las flechas y el anuncio de posicion gobiernan un carrusel que no existe. */
    it('drops the arrows and the carousel semantics', async () => {
      await settle(1440);

      const track = fixture.debugElement.query(By.css('.cases__track')).nativeElement as HTMLElement;

      expect(fixture.debugElement.queryAll(By.css('.cases__control')).length).toBe(0);
      expect(track.getAttribute('aria-roledescription')).toBeNull();
      expect(track.getAttribute('tabindex')).toBeNull();
      expect(fixture.debugElement.query(By.css('.cases__position'))).toBeNull();
    });

    /** Y por debajo del umbral siguen estando, porque ahi si hay algo que desplazar. */
    it('keeps them below the threshold', async () => {
      await settle(900);

      expect(fixture.debugElement.queryAll(By.css('.cases__control')).length).toBe(2);
      expect(fixture.debugElement.query(By.css('.cases__position'))).not.toBeNull();
    });
  });

  /**
   * El antetitulo que la maqueta documenta y el sitio no tenia.
   *
   * Punto 09 de la auditoria UX/UI: el menu promete "Casos de exito" y la seccion a la que
   * lleva se titula "Algunos proyectos desarrollados". No son sinonimos, y quien hace clic
   * llega esperando mas de lo que hay. La maqueta ya resolvia eso con un antetitulo encima del
   * titular, que se perdio al implementar.
   *
   * Sale de la misma clave que la entrada del menu, no de una copia: es la unica forma de que
   * no vuelvan a divergir, que es justo lo que el punto 09 reporta.
   */
  describe('section eyebrow', () => {
    const menuLabel = (): string => {
      const entry = HOME_CONTENT.navigation.find((item) => item.fragment === 'casos')!;
      return t(entry.labelKey);
    };

    it('announces the section with the same name the menu uses', () => {
      const eyebrow = fixture.debugElement.query(By.css('.appland-eyebrow'));

      expect(eyebrow).not.toBeNull();
      expect(eyebrow.nativeElement.textContent.trim()).toBe(menuLabel());
    });

    it('places it above the heading, not after it', () => {
      const container = fixture.debugElement.query(By.css('.cases__heading')).nativeElement as HTMLElement;
      const order = [...container.querySelectorAll('.appland-eyebrow, h2')].map((el) => el.tagName);

      expect(order[0]).not.toBe('H2');
    });
  });
});
